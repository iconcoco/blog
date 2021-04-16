
// Boolean 类型
var isDone: boolean = true

// Number 类型
var count: number = 5


// String 类型
var str: string = '54545'

// Array
var arr: Array<number> = [3, 4, 6]

// 数组元组类型(tuple)
var arr2: [string, number] = ['', 32]


var fn = function (param: string): string {
  return 'hello' + param
}

// void 类型，标示方法没有任何返回类型
function fns(): void {
  console.log('333')
}

function fntt(): number {
  console.log('333')
  return 222
}

// 可选参数
/**
 * 如果age可以不需要传，参数后面加个问好
 */
function getInfo(name: string, age?: number): string {
  return `${name}, ${age}`
}

// 枚举类型 enum
enum flag {success = 1, error = -1 }

var abc:flag = flag.success

// console.log(abc);
// any 类型


// 类

class Person {
  // 共有属性
  public name:string

  constructor(name: string) {
    this.name = name
  }
}

class Lcx extends Person {
  // 私有属性 只能自身类能够访问
  private boy: string

  constructor(name: string) {
    super(name)
  }

}

// 接口： 定义规范
/**
 * 1. 属性接口：对json的一个约束
 * 
 * 
 * 
 * 
 * 
 */
// 定义一个FullName的接口
interface FullName {
  name: string;
  age: number;
}

// 函数类型的接口
interface expose {
  (scrollContainer: string, mask: string):string
}
