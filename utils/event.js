export class EventName {
  // 登录成功
  static LOGIN = 'login';
  // 登出成功
  static LOGOUT = 'logout';
  // 用户改变，用户由未授权到授权状态的改变会触发 该事件
  static USER_CHANGED = 'userChanged';
}

export default class EventBus {
  constructor() {
    this.events = {};
  }

  on(name, self, callback) {
    const events = this.events;
    const tuple = [self, callback];
    const callbacks = events[name];
    if (Array.isArray(callbacks)) {
      callbacks.push(tuple);
    } else {
      events[name] = [tuple];
    }
  }

  remove(name, self) {
    const events = this.events;
    const callbacks = events[name];
    if (Array.isArray(callbacks)) {
      events[name] = callbacks.filter((tuple) => {
        return tuple[0] != self;
      })
    }
  }

  emit(name, data) {
    const events = this.events;
    const callbacks = events[name];
    if (Array.isArray(callbacks)) {
      callbacks.map((tuple) => {
        const self = tuple[0];
        const callback = tuple[1];
        callback.call(self, data);
      })
    }
  }
}