import fs from "fs";
function stripAnsi(e){if("string"!=typeof e)throw new TypeError(`Expected a \`string\`, got \`${typeof e}\``);return e.replace(RegExp(["[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)","(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-nq-uy=><~]))"].join("|")),"")}var term=13;export default function create(e){var t=(e=e||{}).sigint,s=e.eot,r=e.autocomplete=e.autocomplete||function(){return[]},o=e.history;return i.history=o||{save:function(){}},i.hide=function(e){return i(e,{echo:""})},i;function i(e,i,c){var a,p,u=0,d=0;c=c||{},Object(e)===e?e=(c=e).ask:Object(i)===i&&(i=(c=i).value),e=e||"";var f=c.echo,l="echo"in c;r=c.autocomplete||r;var w="win32"===process.platform?process.stdin.fd:fs.openSync("/dev/tty","rs"),g=process.stdin.isRaw;g||process.stdin.setRawMode&&process.stdin.setRawMode(!0);var h,b,k=Buffer.alloc(3),v="";p="",e&&process.stdout.write(e);for(var y=0;;)if((b=fs.readSync(w,k,0,3))>1)switch(k.toString()){case"[A":if(l)break;if(!o)break;if(o.atStart())break;o.atEnd()&&(p=v,d=u),u=(v=o.prev()).length,process.stdout.write("[2K[0G"+e+v);break;case"[B":if(l)break;if(!o)break;if(o.pastEnd())break;o.atPenultimate()?(v=p,u=d,o.next()):u=(v=o.next()).length,process.stdout.write("[2K[0G"+e+v+"["+(u+e.length+1)+"G");break;case"[D":if(l)break;u-(u=--u<0?0:u)&&process.stdout.write("[1D");break;case"[C":if(l)break;u=++u>v.length?v.length:u,process.stdout.write("["+(u+e.length+1)+"G");break;default:k.toString()&&(n(l,e,f,v=(v+=k.toString()).replace(/\0/g,""),u=v.length),process.stdout.write("["+(u+e.length+1)+"G"),k=Buffer.alloc(3))}else{if(3==(h=k[b-1]))return process.stdout.write("^C\n"),fs.closeSync(w),t&&process.exit(130),process.stdin.setRawMode&&process.stdin.setRawMode(g),null;if(4==h&&0==v.length&&s&&(process.stdout.write("exit\n"),process.exit(0)),h==term){if(fs.closeSync(w),!o)break;!l&&v.length&&o.push(v),o.reset();break}if(9==h){if(v==(a=r(v))[0]?a=r(""):a.length,0==a.length){process.stdout.write("\t");continue}var m=a[y++]||a[(y=0,y++)];m&&(process.stdout.write("\r[K"+e+m),v=m,u=m.length)}if(127==h||"win32"==process.platform&&8==h){if(!u)continue;v=v.slice(0,u-1)+v.slice(u),u--,process.stdout.write("[2D")}else{if(h<32||h>126)continue;v=v.slice(0,u)+String.fromCharCode(h)+v.slice(u),u++}n(l,e,f,v,u)}return process.stdout.write("\n"),process.stdin.setRawMode&&process.stdin.setRawMode(g),v||i||""}function n(e,t,s,r,o){if(e)process.stdout.write("[2K[0G"+t+Array(r.length+1).join(s));else{process.stdout.write("[s"),o==r.length?process.stdout.write("[2K[0G"+t+r):t?process.stdout.write("[2K[0G"+t+r):process.stdout.write("[2K[0G"+r+"["+(r.length-o)+"D");var i=stripAnsi(t).length;process.stdout.write(`[${i+1+(""==s?0:o)}G`)}}}