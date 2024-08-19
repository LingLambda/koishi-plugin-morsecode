import { Context, Dict, Schema } from 'koishi'

export const name = 'morsecode'
export const usage =`**将摩斯密码转换为文本或将文本转换为摩斯密码**  
示例:  
morse I love u  
将'I love u'转为莫斯密码  
`
export interface Config {}

export const Config: Schema<Config> = Schema.object({})

const morseCodeDict :Dict = {
    // 字母
    'A': '.-',    'B': '-...',  'C': '-.-.',  'D': '-..',   'E': '.',
    'F': '..-.',  'G': '--.',   'H': '....',  'I': '..',    'J': '.---',
    'K': '-.-',   'L': '.-..',  'M': '--',    'N': '-.',    'O': '---',
    'P': '.--.',  'Q': '--.-',  'R': '.-.',   'S': '...',   'T': '-',
    'U': '..-',   'V': '...-',  'W': '.--',   'X': '-..-',  'Y': '-.--',
    'Z': '--..',
    
    // 数字
    '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-', 
    '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.',
    
    // 符号
    '.': '.-.-.-',  ',': '--..--',  '?': '..--..',  '\'': '.----.',
    '!': '-.-.--',  '/': '-..-.',   '(': '-.--.',   ')': '-.--.-',
    '&': '.-...',   ':': '---...',  ';': '-.-.-.',  '=': '-...-', 
    '+': '.-.-.',   '-': '-....-',  '_': '..--.-',  '"': '.-..-.', 
    '$': '...-..-', '@': '.--.-.',  '  ': '/'    ,  ' ': ' '
};



export function apply(ctx: Context) {

  ctx.command('morse <message:text> 输入摩斯密码或英文文本,即将支持中文')
  .usage('注意：输入摩斯密码时请使用-或_和.')
  .option('toMorse', '-m  输入字转摩斯密码')//指定字转莫斯
  .option('toText', '-t 输入摩斯密码转字,用 / 分割')//指定莫斯转字
  .action(({options},massage) => convert(options,massage))
  .example('morse I LOVE U  将I LOVE U转为莫斯密码')

}

function convert(options: any, massage: string) {
  ////console.log("输入: 参数1:"+options.toMorse+" 参数2:"+options.toText+" "+" 文本:"+massage)
  if (!massage)
    return "未检测到有效输入"
  if (options.toMorse)
    return textToMorse(massage)
  else if (options.toText)
    return morseToText(massage)

  if (massage.charAt(0) == "-" || massage.charAt(0) == "_" || massage.charAt(0) == ".") {
    ////console.log("morse转text 输出:"+morseToText(massage)+"\n")
    return morseToText(massage)==null?"输入有误" : morseToText(massage)
  }
  else {
    ////console.log("text转morse 输出:"+textToMorse(massage)+"\n")
    return textToMorse(massage)==null?"输入有误" : textToMorse(massage)
  }
}

/**
 * 摩斯密码转文本
 * @param massage 摩斯密码:string
 * @returns 文本:string
 */
function morseToText(massage:string){
  let decodedCode : Array<string> = [];
  let charArray:string[] = massage.split("/")
  //将所有 _ 替换为 - 
  charArray.forEach(char => {
    char=='_'?'-':'-'
  });

  charArray.forEach(morseCode => {
    decodedCode.push(invertDict(morseCodeDict)[morseCode])
  });
  return decodedCode.join("")
}

/**
 * 文本转摩斯密码
 * @param massage 文本:string
 * @returns 摩斯密码:string
 */
function textToMorse(massage:string){
  let decodedMessage : Array<string> = [];
  //分割输入字符串为一个个字符的数组
  let charArray:string[] = massage.split("")
  
  charArray.forEach(char => {
    decodedMessage.push(morseCodeDict[char.toUpperCase()])
  });
  return decodedMessage.join("/")
}
/**
 * 键值反转方法
 * @param dict 字典
 * @returns 反转后的字典
 */
function invertDict(dict: Dict): Dict {
  const invertedDict: Dict = {};
  
  for (const key in dict) {
      if (dict.hasOwnProperty(key)) {
          invertedDict[dict[key]] = key;
      }
  }
  
  return invertedDict;
}