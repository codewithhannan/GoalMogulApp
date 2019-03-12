export class DropDownHolder {
  static dropDown;
  static setDropDown(dropDown) {
    this.dropDown = dropDown;
  }
  /**
   * Set drop down image src
   * @param {String} imageSrc 
   */
  static setDropDownImage(imageSrc) {
    return this.dropDown.setImageSrc(imageSrc);
  }
  static getDropDown() {
    return this.dropDown;
  }
  
  /**
   * Show alert toast
   * @param {*} type 
   * @param {*} title 
   * @param {*} message 
   */
  static alert(type, title, message) {
    return this.dropDown.alertWithType(type, title, message);
  }
};