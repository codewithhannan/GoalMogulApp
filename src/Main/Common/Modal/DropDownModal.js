/** @format */

export class DropDownHolder {
    static dropDown
    static setDropDown(dropDown) {
        this.dropDown = dropDown
    }
    /**
     * Set drop down image src
     * @param {String} imageSrc
     */
    static setDropDownImage(imageSrc) {
        return this.dropDown.setImageSrc(imageSrc)
    }
    static getDropDown() {
        return this.dropDown
    }

    /**
     * Set drop down image style
     * Will only be valid for one time
     * @param {*} style
     */
    static setDropDownImageStyle(style) {
        return this.dropDown.setImageStyle(style)
    }

    /**
     * Set drop down image container style
     * Will only be valid for one time
     * @param {*} style
     */
    static setDropDownImageContainerStyle(style) {
        return this.dropDown.setImageContainerStyle(style)
    }

    /**
     * Set one time onClose function
     * @param {*} func
     */
    static setOnClose(func) {
        return this.dropDown.setOnClose(func)
    }

    /**
     * Show alert toast
     * @param {*} type
     * @param {*} title
     * @param {*} message
     */
    static alert(type, title, message) {
        return this.dropDown.alertWithType(type, title, message)
    }
}
