import "./style.css"
import autoAnimate from "@formkit/auto-animate"

let boxes = [
  {
    id: 0,
    color: "red",
  },
  {
    id: 1,
    color: "blue",
  },
  {
    id: 2,
    color: "green",
  },
  {
    id: 3,
    color: "yellow",
  },
]

type TBoxes = typeof boxes

let onDraggedItem: HTMLElement, onDroppedItem: HTMLElement

const mainDiv = document.querySelector(".main") as HTMLElement
autoAnimate(mainDiv)

const createChildren = (boxes: TBoxes) => {
  if (!mainDiv) return
  mainDiv.innerHTML = ""

  for (const boxIndex in boxes) {
    const box = boxes[boxIndex]

    const childDiv = document.createElement("div")
    childDiv.setAttribute("class", "child")
    childDiv.setAttribute("style", `background-color: ${box.color}`)
    childDiv.setAttribute("data-id", String(box.id))
    childDiv.setAttribute("data-index", boxIndex)
    childDiv.setAttribute("draggable", "true")

    childDiv.addEventListener("dragstart", (e) => {
      if (!e?.target) return
      onDraggedItem = e.target as HTMLElement
    })

    childDiv.addEventListener("dragenter", (e) => {
      if (!e?.target) return
      onDroppedItem = e.target as HTMLElement
      const newTarget = e.target as HTMLElement
      if (newTarget?.style) {
        newTarget.style.opacity = "0.5"
        newTarget.style.outline =
          "2px dashed " + newTarget.style.backgroundColor
      }
    })

    childDiv.addEventListener("dragleave", (e) => {
      if (!e?.target) return
      const newTarget = e.target as HTMLElement
      if (newTarget?.style) {
        newTarget.style.opacity = "1"
        newTarget.style.outline = ""
      }
    })

    childDiv.addEventListener("dragend", (e) => {
      swap(onDraggedItem, onDroppedItem)

      const newTarget = e.target as HTMLElement
      if (newTarget?.style) {
        newTarget.style.opacity = "1"
        newTarget.style.outline = ""
      }
    })

    mainDiv.append(childDiv)
  }
}

createChildren(boxes)

const reorderButton = document.querySelector("button")
reorderButton?.addEventListener("click", () => {
  if (!mainDiv?.children) return
  const children = mainDiv?.children
  const sorted = [...children].sort(
    (childA, childB) =>
      Number((childA as HTMLElement).dataset?.id) -
      Number((childB as HTMLElement).dataset?.id)
  )
  for (const sort in sorted) {
    if (Number(sort) !== 0) {
      const sortA = sorted[Number(sort) - 1] as HTMLElement
      const sortB = sorted[Number(sort)] as HTMLElement
      sortA.setAttribute("data-index", String(Number(sort) - 1))
      swap(sortB, sortA, true)
    }
  }
})

function swap(node1: HTMLElement, node2: HTMLElement, isReorder?: boolean) {
  let afterNode2 = node2.nextElementSibling as HTMLElement
  const parent = node2.parentNode

  if (!parent) return
  if (!isReorder && Number(node1.dataset?.index) > Number(node2.dataset?.index))
    afterNode2 = node2

  parent.insertBefore(node1, afterNode2)

  if (!isReorder && parent?.children?.length > 0) {
    for (const i in parent.children) {
      const child = parent.children[Number(i)] as HTMLElement
      if (!child) return
      child?.setAttribute("data-index", i)
    }
  }
}
