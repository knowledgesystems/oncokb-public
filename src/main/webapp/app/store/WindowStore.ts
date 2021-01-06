import { action, observable, computed } from 'mobx';
import _ from 'lodash';
import autobind from 'autobind-decorator';
import { GRID_BREAKPOINTS, PAGE_ROUTE } from 'app/config/constants';
import React from 'react';

export interface IWindowSize {
  width: number;
  height: number;
}

class WindowStore {
  @observable size: IWindowSize;
  @observable recaptchaVerified: boolean;
  public recaptchaRef: any;
  private handleWindowResize = _.debounce(this.setWindowSize, 200);
  private windowObj: any;

  constructor() {
    this.windowObj = window;
    this.setWindowSize();
    this.windowObj.addEventListener('resize', this.handleWindowResize);
    this.windowObj.addEventListener('click', () => {
      if (
        !this.recaptchaVerified &&
        this.windowObj.location.pathname !== PAGE_ROUTE.HOME
      ) {
        this.executeRecaptcha();
      }
    });
    this.recaptchaVerified = false;
    this.recaptchaRef = React.createRef();
  }

  @action
  private executeRecaptcha() {
    if (this.recaptchaRef) {
      this.recaptchaRef.current.execute();
    }
  }

  @autobind
  @action
  private setWindowSize() {
    this.size = {
      width: this.windowObj.innerWidth,
      height: this.windowObj.innerHeight,
    };
  }

  @computed
  get isXLscreen() {
    return this.size.width >= GRID_BREAKPOINTS.XL;
  }

  @computed
  get isLargeScreen() {
    return this.size.width >= GRID_BREAKPOINTS.LG;
  }
}

export default WindowStore;
