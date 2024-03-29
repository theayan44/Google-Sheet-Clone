// we manage the options selection

const activeCellElement = document.getElementById("active-cell");
const textAlignElements = document.getElementsByClassName("text-align");
const fontSizeSelect = document.getElementById("font-size");
const fontFamilySelect = document.getElementById("font-style");
const boldButton = document.getElementById("bold");
const italicButton = document.getElementById("italic");
const underlinedButton = document.getElementById("underlined");

// activeCell defines which cell is selected / active.
// intially it will null indicating that no cell is selected.
let activeCell = null;

let activeOptionsState;

// below function will be triggered whenever cell is focused.
function onCellFocus(e) {
    // whenever a cell is focused change the activeCell value to be the id of cell.
    if (activeCell && activeCell.id === e.target.id) {
        // previously selected cell is equal to the currently selected cell.
        return;
    }
    activeCell = e.target;
    activeCellElement.innerText = e.target.id;
    // intialise the state of this cell.
    const computedStyle = getComputedStyle(activeCell);
    activeOptionsState = {
        fontFamily: computedStyle.fontFamily,
        isBoldSelected: computedStyle.fontWeight === "600",
        isItalicSelected: computedStyle.fontStyle === "italic",
        isUnderLineSelected: computedStyle.textDecoration.includes("underline"),
        textAlign: computedStyle.textAlign,
        textColor: computedStyle.color,
        backgroundColor: computedStyle.backgroundColor,
        fontSize: computedStyle.fontSize
    };

    highlightOptionButtonsOnFocus();
    highlightTextAlignButtons(activeOptionsState.textAlign);
    changeFontSizeAndFamily(activeOptionsState.fontSize, activeOptionsState.fontFamily);
}

function toggleButtonsStyle(button, isSelected) {
    if (isSelected) {
        // currently selected cell in the bold state.
        button.classList.add("active-option");
    } else {
        button.classList.remove("active-option");
    }
}

function changeFontSizeAndFamily(fontSize, fontFamily) {
    if (fontFamily.substring(1, fontFamily.length - 1) == "Times New Roman")
        fontFamily = fontFamily.substring(1, fontFamily.length - 1);
    fontSizeSelect.value = fontSize;
    fontFamilySelect.value = fontFamily;

}

function highlightOptionButtonsOnFocus() {
    // check if the cell is in the bold state or not .
    // if (activeOptionsState.isBoldSelected) {
    //   // currently selected cell in the bold state.
    //   boldButton.classList.add("active-option");
    // } else {
    //   boldButton.classList.remove("active-option");
    // }

    toggleButtonsStyle(boldButton, activeOptionsState.isBoldSelected);

    // check if the selected cell is italic or not .
    // if (activeOptionsState.isItalicSelected) {
    //   // the current cell is italic text.
    //   italicButton.classList.add("active-option");
    // } else {
    //   italicButton.classList.remove("active-option");
    // }
    toggleButtonsStyle(italicButton, activeOptionsState.isItalicSelected);

    // check if the selected cell is underline or not .

    // if (activeOptionsState.isUnderLineSelected) {
    //   // the cell is underlined
    //   underlinedButton.classList.add("active-option");
    // } else {
    //   underlinedButton.classList.remove("active-option");
    // }
    toggleButtonsStyle(underlinedButton, activeOptionsState.isUnderLineSelected);
}

// the below function task is to take the textAlign value and decides which alignment button needs to highlighted or not.
function highlightTextAlignButtons(textAlignValue) {
    // textAlignValue === "left" => we have to highlight only left button
    // textAlignValue === "right" => we have to highlight only right button
    // textAlignValue === "center" => we have to highlight only center button
    for (let i = 0; i < textAlignElements.length; i++) {
        if (textAlignElements[i].getAttribute("data-value") === textAlignValue) {
            textAlignElements[i].classList.add("active-option");
        } else {
            textAlignElements[i].classList.remove("active-option");
        }
    }
}

// Add Copy Functionality
function onCopy() {
    if (activeCell) {
        const textToCopy = activeCell.innerText;
        navigator.clipboard.writeText(textToCopy).then(() => {
            alert("Text copied to clipboard");
        }).catch(err => {
            alert("Unable to copy text: ", err);
        });
    }
}

// Add Cut Functionality
function onCut() {
    if (activeCell) {
        const textToCut = activeCell.innerText;
        navigator.clipboard.writeText(textToCut).then(() => {
            activeCell.innerText = '';
        }).catch(err => {
            console.error("Unable to cut text: ", err);
        });
    }
}

// Add Paste Functionality
async function onPaste() {
    if (activeCell) {
        try {
            activeCell.innerText = await navigator.clipboard.readText();
        } catch (err) {
            alert("Unable to paste: ", err);
        }
    }
}

function onChangeFontStyle(fontFamilyInput) {
    let selectedFont = fontFamilyInput.value;
    if (activeCell) {
        activeCell.style.fontFamily = selectedFont;
        activeOptionsState.fontFamily = selectedFont;
    }
}

// Add Font Size Functionality
function onChangeFontSize(fontSizeInput) {
    let selectedSize = fontSizeInput.value;
    if (activeCell) {
        activeCell.style.fontSize = selectedSize;
        activeOptionsState.fontSize = selectedSize;
    }
}

function onClickBold(boldButton) {
    // this function will be triggered when user clicks on the Bold button.
    /**
     * 1. toggle `active-option` class for the button.
     * 2. get the selected cell.
     */
    boldButton.classList.toggle("active-option");
    if (activeCell) {
        if (activeOptionsState.isBoldSelected === false) {
            // make the text to bold
            activeCell.style.fontWeight = "600";
        } else {
            // make the text to normal
            activeCell.style.fontWeight = "400";
        }
        activeOptionsState.isBoldSelected = !activeOptionsState.isBoldSelected;
    }
}

function onClickItalic(italicButton) {
    /**
     * 1. toggle the active-option class for the italic button.
     */
    italicButton.classList.toggle("active-option");
    if (activeCell) {
        if (activeOptionsState.isItalicSelected) {
            // the text already italic.
            activeCell.style.fontStyle = "normal";
        } else {
            activeCell.style.fontStyle = "italic";
        }
        activeOptionsState.isItalicSelected = !activeOptionsState.isItalicSelected;
    }
}

function onClickUnderline(underlinedButton) {
    underlinedButton.classList.toggle("active-option");
    if (activeCell) {
        if (activeOptionsState.isUnderLineSelected) {
            // if the text is underlined => none
            activeCell.style.textDecoration = "none";
        } else {
            activeCell.style.textDecoration = "underline";
        }
        activeOptionsState.isUnderLineSelected = !activeOptionsState.isUnderLineSelected;
    }
}

function onClickTextAlign(textAlignButton) {
    let selectedValue = textAlignButton.getAttribute("data-value");
    highlightTextAlignButtons(selectedValue);

    // change the text alignment.
    if (activeCell) {
        activeCell.style.textAlign = selectedValue;
        activeOptionsState.textAlign = selectedValue;
    }
}

function onChangeTextColor(textColorInput) {
    let selectedColor = textColorInput.value;
    if (activeCell) {
        activeCell.style.color = selectedColor;
        activeOptionsState.color = selectedColor;
    }
}

function onChangeBackgroundColor(textColorInput) {
    let selectedColor = textColorInput.value;
    if (activeCell) {
        activeCell.style.backgroundColor = selectedColor;
        activeOptionsState.backgroundColor = selectedColor;
    }
}



