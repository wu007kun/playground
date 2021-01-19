import './style.css'
import { h, resolveComponent } from 'vue'
export default ({
  Vue, defaultPassword, title
}) => {
  Vue.component('loginComp', {
    render () {
      return h('div', {
        class: ['tools-login']
      }, [
        h('h1', {
          class: ['title']
        }, title),
        h('div', {
          class: ['form']
        }, [
          this.ready ? [
            h('div', {
              class: ['form-line']
            }, [
              h('label', '密码'),
              h('input', {
                type: 'password',
                value: this.password,
                onInput: (e) => {
                  this.password = e.target.value
                },
                onKeyup: e => {
                  if (e.key === 'Enter') {
                    this.submit()
                  }
                }
              })
            ]),
            h('button', {
              onClick: this.submit
            }, '登录')
          ] : [h('p', {
            class: ['form-line']
          }, '请稍候...')]
        ])
      ])
    },
    data: function () {
      return {
        ready: false,
        password: '',
        key: 3588,
        tailLength: 3
      }
    },
    mounted () {
      this.loadSha1().then(() => {
        this.ready = true
      })
    },
    methods: {
      submit () {
        if (this.password === defaultPassword) {
          localStorage.setItem('tempLogin', new Date().getTime() + 48 * 3600 * 1000)
          this.$emit('success')
          return
        }
        const res = this.decodePassword(this.password)
        if (res.code === 200) {
          localStorage.setItem('tempLogin', res.expireAt)
          this.$emit('success', res.message)
        } else {
          this.$emit('error', res.message)
        }
      },
      loadSha1 () {
        return new Promise((resolve, reject) => {
          const old = Array.from(document.head.children).find(
            d => d.tagName === 'SCRIPT' && d.src.indexOf('js-sha1/0.6.0/sha1.min.js') !== -1
          )
          if (old) {
            document.head.removeChild(old)
          }
          const script = document.createElement('script')
          script.src = 'https://cdn.bootcdn.net/ajax/libs/js-sha1/0.6.0/sha1.min.js'
          script.onload = resolve
          script.onerror = reject
          document.head.appendChild(script)
        })
      },
      decodePassword (password) {
        password = password.toString()
        // 从密码中分离出36进制字符串和尾巴
        const n36 = password.substring(0, password.length - this.tailLength)
        const tail = password.substring(password.length - this.tailLength)
        // 36位字符串转化为10进制数字，即(reversed - 0 + key)
        const n10 = Number.parseInt(n36, 36)
        // 10进制数字减去密钥并补0得到reversed
        const reversed = this.addZero(n10 - this.key, 8)
        // 再反转得到过期时间
        const expireAt = reversed.split('').reverse().join('') - 0
        // 用解得的过期时间和密钥计算sha
        /* eslint-disable */
          const sha = sha1(`${expireAt}${this.key}`)
          // 校验sha的后3位是否等于尾巴
          if (tail === sha.substring(sha.length - this.tailLength)) {
            const expireStr = `${expireAt.toString().substring(0, 4)}-${expireAt.toString().substring(4, 6)}-${expireAt.toString().substring(6, 8)}`
            const expireTime = new Date(expireStr).getTime()
            const now = new Date()
            const nowStr = `${now.getFullYear()}-${this.addZero(now.getMonth() + 1)}-${this.addZero(now.getDate())}`
            const nowTime = new Date(nowStr).getTime()
            if (expireTime > nowTime) {
              return {
                code: 200,
                expireAt: expireTime,
                message: `登录成功, 密码将于 ${expireStr} 过期`
              }
            } else {
              return {
                code: 403,
                message: `密码已过期（${expireStr}）`
              }
            }
          } else {
            return {
              code: 403,
              message: '密码错误'
            }
          }
      },
      addZero (num, total = 2) {
        const str = `${new Array(total).fill(0).join('')}${num}`
        return str.substring(str.length - total)
      }
    }
  })
  return {
    setup () {
      const comp = resolveComponent('loginComp')
      return () => h(comp)
    }
  }
}
// export default class {
//   constructor ({
//     Vue, onSuccess, onError, defaultPassword, title
//   }) {
//     this.onSuccess = onSuccess
//     this.onError = onError
//     this.title = title
//     this.defaultPassword = defaultPassword
//     const thisClass = this
//     this.component = Vue.component('loginComp', {
//       render () {
//         return h('div', {
//           class: ['tools-login']
//         }, [
//           h('h1', {
//             class: ['title']
//           }, thisClass.title),
//           h('div', {
//             class: ['form']
//           }, [
//             this.ready ? [
//               h('div', {
//                 class: ['form-line']
//               }, [
//                 h('label', '密码'),
//                 h('input', {
//                   type: 'password',
//                   value: this.password,
//                   onInput: (e) => {
//                     this.password = e.target.value
//                   },
//                   onKeyup: e => {
//                     if (e.key === 'Enter') {
//                       this.submit()
//                     }
//                   }
//                 })
//               ]),
//               h('button', {
//                 onClick: this.submit
//               }, '登录')
//             ] : [h('p', {
//               class: ['form-line']
//             }, '请稍候...')]
//           ])
//         ])
//       },
//       data: function () {
//         return {
//           ready: false,
//           password: '',
//           key: 3588,
//           tailLength: 3
//         }
//       },
//       mounted () {
//         this.loadSha1().then(() => {
//           this.ready = true
//         })
//       },
//       methods: {
//         submit () {
//           if (this.password === thisClass.defaultPassword) {
//             localStorage.setItem('tempLogin', new Date().getTime() + 48 * 3600 * 1000)
//             thisClass.onSuccess()
//             return
//           }
//           const res = this.decodePassword(this.password)
//           if (res.code === 200) {
//             localStorage.setItem('tempLogin', res.expireAt)
//             thisClass.onSuccess(res.message)
//           } else {
//             thisClass.onError(res.message)
//           }
//         },
//         loadSha1 () {
//           return new Promise((resolve, reject) => {
//             const old = Array.from(document.head.children).find(
//               d => d.tagName === 'SCRIPT' && d.src.indexOf('js-sha1/0.6.0/sha1.min.js') !== -1
//             )
//             if (old) {
//               document.head.removeChild(old)
//             }
//             const script = document.createElement('script')
//             script.src = 'https://cdn.bootcdn.net/ajax/libs/js-sha1/0.6.0/sha1.min.js'
//             script.onload = resolve
//             script.onerror = reject
//             document.head.appendChild(script)
//           })
//         },
//         decodePassword (password) {
//           password = password.toString()
//           // 从密码中分离出36进制字符串和尾巴
//           const n36 = password.substring(0, password.length - this.tailLength)
//           const tail = password.substring(password.length - this.tailLength)
//           // 36位字符串转化为10进制数字，即(reversed - 0 + key)
//           const n10 = Number.parseInt(n36, 36)
//           // 10进制数字减去密钥并补0得到reversed
//           const reversed = this.addZero(n10 - this.key, 8)
//           // 再反转得到过期时间
//           const expireAt = reversed.split('').reverse().join('') - 0
//           // 用解得的过期时间和密钥计算sha
//           /* eslint-disable */
//             const sha = sha1(`${expireAt}${this.key}`)
//             // 校验sha的后3位是否等于尾巴
//             if (tail === sha.substring(sha.length - this.tailLength)) {
//               const expireStr = `${expireAt.toString().substring(0, 4)}-${expireAt.toString().substring(4, 6)}-${expireAt.toString().substring(6, 8)}`
//               const expireTime = new Date(expireStr).getTime()
//               const now = new Date()
//               const nowStr = `${now.getFullYear()}-${this.addZero(now.getMonth() + 1)}-${this.addZero(now.getDate())}`
//               const nowTime = new Date(nowStr).getTime()
//               if (expireTime > nowTime) {
//                 return {
//                   code: 200,
//                   expireAt: expireTime,
//                   message: `登录成功, 密码将于 ${expireStr} 过期`
//                 }
//               } else {
//                 return {
//                   code: 403,
//                   message: `密码已过期（${expireStr}）`
//                 }
//               }
//             } else {
//               return {
//                 code: 403,
//                 message: '密码错误'
//               }
//             }
//         },
//         addZero (num, total = 2) {
//           const str = `${new Array(total).fill(0).join('')}${num}`
//           return str.substring(str.length - total)
//         }
//       }
//     })
//   }
// }
