class JarvisCapture extends AudioWorkletProcessor {
 constructor(){super();this.buffer=new Float32Array(2048);this.offset=0;}
 process(inputs){const input=inputs[0]?.[0];if(input){for(let i=0;i<input.length;i++){this.buffer[this.offset++]=input[i];if(this.offset===2048){this.port.postMessage(this.buffer,[this.buffer.buffer]);this.buffer=new Float32Array(2048);this.offset=0;}}}return true;}
}
registerProcessor('jarvis-capture',JarvisCapture);