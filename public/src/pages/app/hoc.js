export default function(component) {
  return {
    name: 'hocComponent',
    props: ['hocText'],
    render(createElement) {
      
      const slots = Object.keys(this.$slots)
        .reduce((arr, key) => arr.concat(this.$slots[key]), [])
        .map(vn => {
          vn.context = this //绑定到高阶组件上
          return vn
        })
      return createElement(component, {
        props: this.$props,
        attrs: this.$attrs,
        on: this.$listeners
      }, slots)
    },
  }
}
