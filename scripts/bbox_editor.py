import argparse
import json
import os
from dataclasses import dataclass, asdict
from typing import List, Optional, Dict, Any, Tuple

import matplotlib.pyplot as plt
from matplotlib.patches import Rectangle
from matplotlib.backend_bases import MouseEvent, KeyEvent
from matplotlib.widgets import TextBox
from PIL import Image


@dataclass
class BBox:
    x1: float
    y1: float
    x2: float
    y2: float


@dataclass
class Obj:
    id: str
    name: str
    bbox: BBox
    priority: int = 1


class BBoxEditor:
    """
    Simple interactive bounding-box editor for a single scene image.

    - Left click + drag on empty area: create new box
    - Click near a corner of an existing box then drag: resize
    - Click inside an existing box then drag: move
    - Keyboard:
        - n: rename selected box
        - d: delete selected box
        - s: save to JSON and print JS snippet
        - q: save and quit
    """

    CORNER_RADIUS = 3.0  # percent distance threshold for corner hit-test

    def __init__(self, image_path: str, objects: List[Obj], output_path: str):
        self.image_path = image_path
        self.objects: List[Obj] = objects
        self.output_path = output_path

        self.img = Image.open(self.image_path)
        # Two-panel layout: image on the left, object list + name editor on the right
        self.fig, (self.ax, self.ax_list) = plt.subplots(
            1, 2, figsize=(12, 6), gridspec_kw={"width_ratios": [3, 1]}
        )
        self.ax.imshow(self.img)
        self.ax.axis("off")
        self.ax_list.set_xlim(0, 1)
        self.ax_list.set_ylim(0, 1)
        self.ax_list.set_yscale("linear")
        self.ax_list.axis("off")

        # Text box for renaming the currently selected object.
        # Keep it entirely in the right column (no overlap with image).
        name_ax = self.fig.add_axes([0.61, 0.04, 0.34, 0.06])
        self.name_box = TextBox(name_ax, "Name", initial="")
        self.name_box.on_submit(self.on_name_submit)

        # Matplotlib artists
        self.patches: Dict[str, Rectangle] = {}
        self.labels: Dict[str, Any] = {}
        self.list_rows: List[Tuple[float, str]] = []  # (y-position, obj_id)

        # Interaction state
        self.mode: Optional[str] = None  # "creating", "moving", "resizing"
        self.active_id: Optional[str] = None
        self.start_px: Optional[Tuple[float, float]] = None
        self.start_bbox: Optional[BBox] = None
        self.resizing_corner: Optional[str] = None  # "tl", "tr", "bl", "br"

        self._draw_all()

        self.cid_press = self.fig.canvas.mpl_connect("button_press_event", self.on_press)
        self.cid_release = self.fig.canvas.mpl_connect("button_release_event", self.on_release)
        self.cid_move = self.fig.canvas.mpl_connect("motion_notify_event", self.on_move)
        self.cid_key = self.fig.canvas.mpl_connect("key_press_event", self.on_key)

    # --- Utils ---------------------------------------------------------------

    def _percent_from_event(self, event: MouseEvent) -> Tuple[float, float]:
        w, h = self.img.size
        x_pct = (event.xdata / w) * 100.0
        y_pct = (event.ydata / h) * 100.0
        return x_pct, y_pct

    def _get_obj(self, obj_id: str) -> Optional[Obj]:
        for o in self.objects:
            if o.id == obj_id:
                return o
        return None

    def _set_active(self, obj_id: Optional[str]):
        self.active_id = obj_id
        # Update name text box: start empty so you can immediately type a
        # replacement without having to delete existing characters. The
        # current name is still visible in the right-hand list.
        if self.active_id:
            self.name_box.set_val("")
        self._draw_all()

    def _draw_all(self):
        # Clear existing artists
        for p in self.patches.values():
            p.remove()
        for t in self.labels.values():
            t.remove()
        self.patches.clear()
        self.labels.clear()

        for obj in self.objects:
            self._draw_obj(obj)

        # Redraw object list on the right
        self.ax_list.clear()
        self.ax_list.set_xlim(0, 1)
        self.ax_list.set_ylim(0, 1)
        self.ax_list.set_yscale("linear")
        self.ax_list.axis("off")
        self.list_rows.clear()
        y = 0.95
        for idx, obj in enumerate(self.objects, start=1):
            marker = "→ " if obj.id == self.active_id else "  "
            self.ax_list.text(
                0.02,
                y,
                f"{marker}{idx}. {obj.name}",
                transform=self.ax_list.transAxes,
                fontsize=8,
                color="black",
            )
            self.list_rows.append((y, obj.id))
            y -= 0.05

        self.fig.canvas.draw_idle()

    def _draw_obj(self, obj: Obj):
        x = obj.bbox.x1
        y = obj.bbox.y1
        w = obj.bbox.x2 - obj.bbox.x1
        h = obj.bbox.y2 - obj.bbox.y1

        img_w, img_h = self.img.size
        edge = "yellow" if obj.id == self.active_id else "lime"
        rect = Rectangle(
            (x * img_w / 100.0, y * img_h / 100.0),
            w * img_w / 100.0,
            h * img_h / 100.0,
            linewidth=2,
            edgecolor=edge,
            facecolor="none",
        )
        self.ax.add_patch(rect)
        label = self.ax.text(
            x * img_w / 100.0,
            y * img_h / 100.0 - 5,
            obj.name,
            color="yellow",
            fontsize=8,
            bbox=dict(facecolor="black", alpha=0.5, pad=1),
        )
        self.patches[obj.id] = rect
        self.labels[obj.id] = label

    def _hit_test(self, x_pct: float, y_pct: float) -> Tuple[Optional[str], Optional[str]]:
        """
        Returns (obj_id, corner) where corner is one of:
        - "tl", "tr", "bl", "br" when near a corner
        - "inside" when inside a box
        - (None, None) if no hit
        """
        for obj in reversed(self.objects):  # prefer last drawn (visually on top)
            b = obj.bbox
            # Corner hit-test
            corners = {
                "tl": (b.x1, b.y1),
                "tr": (b.x2, b.y1),
                "bl": (b.x1, b.y2),
                "br": (b.x2, b.y2),
            }
            for name, (cx, cy) in corners.items():
                if abs(x_pct - cx) <= self.CORNER_RADIUS and abs(y_pct - cy) <= self.CORNER_RADIUS:
                    return obj.id, name

            # Inside box
            if b.x1 <= x_pct <= b.x2 and b.y1 <= y_pct <= b.y2:
                return obj.id, "inside"

        return None, None

    # --- Event handlers ------------------------------------------------------

    def on_press(self, event: MouseEvent):
        # Click on right-hand list: select object
        if event.inaxes == self.ax_list and event.button == 1 and event.ydata is not None:
            # list_rows stores approximate y positions in axes/data coords (0–1)
            for y, obj_id in self.list_rows:
                if abs(event.ydata - y) <= 0.03:
                    self._set_active(obj_id)
                    return
            return

        if event.inaxes != self.ax or event.button != 1 or event.xdata is None or event.ydata is None:
            return

        x_pct, y_pct = self._percent_from_event(event)
        obj_id, where = self._hit_test(x_pct, y_pct)

        if obj_id and where in {"tl", "tr", "bl", "br"}:
            self._set_active(obj_id)
            # Start resizing
            self.mode = "resizing"
            self.resizing_corner = where
            self.start_bbox = BBox(**vars(self._get_obj(obj_id).bbox))
        elif obj_id and where == "inside":
            self._set_active(obj_id)
            # Start moving
            self.mode = "moving"
            self.start_px = (x_pct, y_pct)
            self.start_bbox = BBox(**vars(self._get_obj(obj_id).bbox))
        else:
            # Start creating a new box
            self.mode = "creating"
            self.active_id = None
            self.start_px = (x_pct, y_pct)
            self.start_bbox = None

    def on_move(self, event: MouseEvent):
        if event.inaxes != self.ax or event.button != 1 or event.xdata is None or event.ydata is None:
            return
        if self.mode is None:
            return

        x_pct, y_pct = self._percent_from_event(event)

        if self.mode == "creating" and self.start_px:
            x1 = min(self.start_px[0], x_pct)
            y1 = min(self.start_px[1], y_pct)
            x2 = max(self.start_px[0], x_pct)
            y2 = max(self.start_px[1], y_pct)
            # Draw a temporary rectangle as a preview
            temp = Obj(id="_preview", name="", bbox=BBox(x1, y1, x2, y2))
            self._draw_all()
            self._draw_obj(temp)
            self.fig.canvas.draw_idle()

        elif self.mode == "moving" and self.active_id and self.start_px and self.start_bbox:
            dx = x_pct - self.start_px[0]
            dy = y_pct - self.start_px[1]
            b = self.start_bbox
            new_bbox = BBox(
                x1=b.x1 + dx,
                y1=b.y1 + dy,
                x2=b.x2 + dx,
                y2=b.y2 + dy,
            )
            obj = self._get_obj(self.active_id)
            obj.bbox = new_bbox
            self._draw_all()

        elif self.mode == "resizing" and self.active_id and self.start_bbox:
            b = self.start_bbox
            nx1, ny1, nx2, ny2 = b.x1, b.y1, b.x2, b.y2
            if self.resizing_corner == "tl":
                nx1, ny1 = x_pct, y_pct
            elif self.resizing_corner == "tr":
                nx2, ny1 = x_pct, y_pct
            elif self.resizing_corner == "bl":
                nx1, ny2 = x_pct, y_pct
            elif self.resizing_corner == "br":
                nx2, ny2 = x_pct, y_pct
            obj = self._get_obj(self.active_id)
            obj.bbox = BBox(
                x1=min(nx1, nx2),
                y1=min(ny1, ny2),
                x2=max(nx1, nx2),
                y2=max(ny1, ny2),
            )
            self._draw_all()

    def on_release(self, event: MouseEvent):
        if event.button != 1 or self.mode is None:
            return

        if self.mode == "creating" and self.start_px and event.xdata is not None and event.ydata is not None:
            x_pct, y_pct = self._percent_from_event(event)
            x1 = min(self.start_px[0], x_pct)
            y1 = min(self.start_px[1], y_pct)
            x2 = max(self.start_px[0], x_pct)
            y2 = max(self.start_px[1], y_pct)
            if abs(x2 - x1) > 1 and abs(y2 - y1) > 1:
                obj_index = len(self.objects) + 1
                name = f"Object_{obj_index}"
                obj_id = f"obj_{obj_index}"
                new_obj = Obj(id=obj_id, name=name, bbox=BBox(x1, y1, x2, y2), priority=1)
                self.objects.append(new_obj)
                self._set_active(obj_id)

        self.mode = None
        self.start_px = None
        self.start_bbox = None
        self.resizing_corner = None

    def on_key(self, event: KeyEvent):
        if event.key == "s":
            self.save()
        # Deliberately avoid binding single-letter shortcuts like "q", "d", etc.
        # so that typing into the Name box does not trigger unexpected
        # actions. To quit, just close the window using the OS controls.

    def on_name_submit(self, text: str):
        if not self.active_id:
            return
        new_name = text.strip()
        if not new_name:
            return
        obj = self._get_obj(self.active_id)
        if not obj:
            return
        obj.name = new_name
        self._draw_all()

    # --- Persistence ---------------------------------------------------------

    def save(self):
        data = [
            {
                "id": o.id,
                "name": o.name,
                "bbox": asdict(o.bbox),
                "priority": o.priority,
            }
            for o in self.objects
        ]
        os.makedirs(os.path.dirname(self.output_path), exist_ok=True)
        with open(self.output_path, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print(f"Saved {len(self.objects)} objects to {self.output_path}")

        # Also print a JS-ready snippet for quick copy into scene-playground.js if desired.
        print("\nJS snippet (allObjects):")
        print("allObjects: [")
        for o in self.objects:
            b = o.bbox
            print(
                f'  {{ id: "{o.id}", name: "{o.name}", bbox: {{ x1: {b.x1:.1f}, y1: {b.y1:.1f}, x2: {b.x2:.1f}, y2: {b.y2:.1f} }}, priority: {o.priority} }},'
            )
        print("]")


def load_seed(path: Optional[str]) -> List[Obj]:
    if not path or not os.path.exists(path):
        return []
    with open(path, "r", encoding="utf-8") as f:
        raw = json.load(f)
    objs: List[Obj] = []
    for item in raw:
        bbox = item.get("bbox") or {}
        objs.append(
            Obj(
                id=item.get("id", f"obj_{len(objs)+1}"),
                name=item.get("name", "Object"),
                bbox=BBox(
                    x1=float(bbox.get("x1", 10.0)),
                    y1=float(bbox.get("y1", 10.0)),
                    x2=float(bbox.get("x2", 20.0)),
                    y2=float(bbox.get("y2", 20.0)),
                ),
                priority=int(item.get("priority", 1)),
            )
        )
    return objs


def main():
    parser = argparse.ArgumentParser(description="Interactive bounding-box editor for I Spy scenes.")
    parser.add_argument("--image", required=True, help="Path to background image (e.g. scene_playground.jpg)")
    parser.add_argument("--output", required=True, help="Output JSON file for objects/bboxes")
    parser.add_argument("--seed", help="Optional existing JSON with objects to refine")
    args = parser.parse_args()

    objs = load_seed(args.seed)
    editor = BBoxEditor(args.image, objs, args.output)
    plt.show()


if __name__ == "__main__":
    main()

