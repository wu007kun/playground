export default class Overlay {
  destruct () {
    this.sandbox.remove(this)
  }

  on (type, callback, option = {}) {
    const entityIdMap = this.sandbox.eventTypeMap.get(type)
    if (entityIdMap) {
      if (!entityIdMap.has(this.id)) {
        entityIdMap.set(this.id, new Map())
      }
      const callbackMap = entityIdMap.get(this.id)
      callbackMap.set(callback, option)
    } else {
      console.error('事件类型有误')
    }
  }

  off (type, callback) {
    const entityIdMap = this.eventTypeMap.get(type)
    if (entityIdMap) {
      const callbackMap = entityIdMap.get(this.id)
      if (callbackMap && callbackMap.has(callback)) {
        callbackMap.delete(callback)
      }
    } else {
      console.error('事件类型有误')
    }
  }
}
