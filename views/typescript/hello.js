// Boolean 类型
var isDone = true;
// Number 类型
var count = 5;
// String 类型
var str = '54545';
// Array
var arr = [3, 4, 6];
// 数组元组类型(tuple)
var arr2 = ['', 32];
var fn = function (param) {
    return 'hello' + param;
};
// void 类型，标示方法没有任何返回类型
function fns() {
    console.log('333');
}
function fntt() {
    console.log('333');
    return 222;
}
function getInfo(name, age) {
    return name + ", " + age;
}
// 枚举类型 enum
var flag;
(function (flag) {
    flag[flag["success"] = 1] = "success";
    flag[flag["error"] = -1] = "error";
})(flag || (flag = {}));
var abc = flag.success;
console.log(abc);
// any 类型
