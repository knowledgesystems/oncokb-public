import { action, observable, computed } from 'mobx';
import autobind from 'autobind-decorator';
import { GRID_BREAKPOINTS, PAGE_ROUTE } from 'app/config/constants';
import { debounce } from 'app/shared/utils/LodashUtils';

export interface IWindowSize {
  width: number;
  height: number;
}

class WindowStore {
  @observable size: IWindowSize;
  private handleWindowResize = debounce(this.setWindowSize, 200);
  private windowObj: any;
  private onClickEvents: { (event: any): void }[] = [];

  constructor() {
    this.windowObj = window;
    this.setWindowSize();
    this.windowObj.addEventListener('resize', this.handleWindowResize);
    this.windowObj.addEventListener('click', (event: any) => {
      this.onClickEvents.forEach(item => item(event));
    });
  }

  public registerOnClickEvent(func: { (event: any): void }) {
    this.onClickEvents.push(func);
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

  @computed
  get isMDScreen() {
    return this.size.width >= GRID_BREAKPOINTS.MD;
  }

  @computed
  get isSMScreen() {
    return this.size.width >= GRID_BREAKPOINTS.SM;
  }

  @computed
  get baseUrl() {
    return window.location.origin;
  }
}

export default WindowStore;
