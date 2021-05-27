# 更新备忘
**2021-05-27**
- 坐标轴标线不用canvas，改用DOM元素，用transform控制
**2021-05-16**
- 重新设计事件结构，改用三层Map结构，兼顾了回调去重和option
- 实现了普通实体的permeate选项，但业务功能上还没有应用场景
- polygon和rect继承自同一个class overlay
**2021-04-26**
- 实现整个实例的销毁方法  
**2021-02-08**
- 实现编辑时可拖拽  
- 设置坐标和设置cursor分离，解决鼠标在entity上时设置坐标和十字线失效

# 功能备忘
### 事件option的permeate
渗透，代表事件可由上层元素渗透到此元素。若实体A的某事件设置了permeate: true，当判断事件生效时，即使A上层有另一个实体B遮挡并接管了本次事件，该事件仍然能渗透到A上。
例如鼠标在某多边形上触发mousemove将光标设为手型，此时也会触发底图Sandbox的mousemove，设置当前坐标——事件渗透到了Sandbox上。
又如鼠标在控制圆上mousedown+mousemove，topChild是控制圆并将光标设为十字拖动，同时也触发Sandbox的mousemove，从而实现拖动。

# 开发计划
- 业务代码太长，能否把更多功能封装到库中，如拖动和缩放操作
- canvas元素封装到库中，Sandbox的constructor接受外层包裹的div，并在内部创建canvas元素
- 没必要每一帧都重新渲染，设一个变量，代表是否发生了变化
- 实现按键鼠标操作，如按住ctrl拖动
