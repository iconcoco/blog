(window.webpackJsonp=window.webpackJsonp||[]).push([[6],{102:function(t,a){},123:function(t,a,e){"use strict";e.r(a);var i=e(28),n=e(14);for(var s in n)"default"!==s&&function(t){e.d(a,t,(function(){return n[t]}))}(s);var r=e(1),c=Object(r.a)(n.default,i.a,i.b,!1,null,null,null);c.options.__file="public/src/pages/app/pages/article/article.vue",a.default=c.exports},14:function(t,a,e){"use strict";e.r(a);var i=e(15),n=e.n(i);for(var s in i)"default"!==s&&function(t){e.d(a,t,(function(){return i[t]}))}(s);a.default=n.a},15:function(t,a,e){"use strict";Object.defineProperty(a,"__esModule",{value:!0});var i=o(e(19)),n=o(e(20));e(102);var s,r=e(22),c=o(e(37));function o(t){return t&&t.__esModule?t:{default:t}}a.default={components:{avatar:c.default},data:function(){return{info:null}},mounted:(s=(0,n.default)(i.default.mark((function t(){var a,e;return i.default.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(!(a=this.$route.params).id){t.next=6;break}return t.next=4,(0,r.getArticle)({id:a.id});case 4:(e=t.sent)&&0==e.code&&(this.info=e.data);case 6:case"end":return t.stop()}}),t,this)}))),function(){return s.apply(this,arguments)}),methods:{onEditArticle:function(){this.$router.push({name:"person",params:{id:this.$route.params.id}})}}}},28:function(t,a,e){"use strict";e.d(a,"a",(function(){return i})),e.d(a,"b",(function(){return n}));var i=function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("div",{staticClass:"blog-block-content blog-article"},[e("aside",{staticClass:"blog-article__info"},[e("p",{staticClass:"blog-article__info-title"},[t._v("个人资料")]),t._v(" "),e("div",{staticClass:"blog-article__info-content"},[e("avatar"),t._v(" "),e("p",{staticClass:"blog-motto"},[t._v("我要成为有钱人")])],1)]),t._v(" "),t.info?e("div",{staticClass:"blog-article__content"},[e("div",{staticClass:"blog-article__content-container"},[e("section",{staticClass:"blog-article__header"},[e("h3",[t._v(t._s(t.info.name))]),t._v(" "),e("div",{staticClass:"blog-article__header-info"},[e("span",[e("a",{staticClass:"el-icon-edit-outline",attrs:{href:"javascript:;"},on:{click:t.onEditArticle}})]),t._v(" "),e("span",[t._v("2020-09-01")]),t._v(" "),t._m(0)])]),t._v(" "),e("article",{staticClass:"blog-article__main",domProps:{innerHTML:t._s(t.info.content)}})])]):t._e()])},n=[function(){var t=this.$createElement,a=this._self._c||t;return a("span",[a("i",{staticClass:"el-icon-view"}),this._v(" 1234123")])}];i._withStripped=!0},36:function(t,a){},37:function(t,a,e){"use strict";e.r(a);var i=function(){var t=this.$createElement;this._self._c;return this._m(0)};i._withStripped=!0;e(58);var n=e(1),s=Object(n.a)({},i,[function(){var t=this.$createElement,a=this._self._c||t;return a("div",{staticClass:"blog-avatar"},[a("div",{staticClass:"blog-avatar__img"}),this._v(" "),a("p",{staticClass:"blog-avatar__name"},[this._v("name")])])}],!1,null,"3dd7caab",null);s.options.__file="public/src/pages/app/pages/components/avatar.vue";a.default=s.exports},58:function(t,a,e){"use strict";e(36)}}]);