import {Wechaty} from "wechaty";
import QrTerm from "qrcode-terminal";
import Service from "./service";
import {HELLO_WORLD, MY_NAME} from "./config";

export default class WechatBoy {
  constructor() {
    this.onScan = this.onScan.bind(this);
    this.onLogin = this.onLogin.bind(this);
    this.onMessage = this.onMessage.bind(this);
    this.onLogout = this.onLogout.bind(this);

    this.boy = Wechaty.instance({ name: 'wechat-boy' });
    this.boy.on('scan', this.onScan)
      .on('login', this.onLogin)
      .on('message', this.onMessage)
      .on('logout', this.onLogout)
      .start()
      .then(() => {
        console.log('start login your wechat account')
      }).catch(e => {
      console.error(e)
    });
  }

  onScan(qrCode) {
    console.log('onScan: ' + qrCode);
    QrTerm.generate(qrCode);
  };

  onLogin(user) {
    console.log(`user ${user} login !`);
    this.awake();
  };

  async onMessage (msg) {
    if (msg.self()) return;
    const contact = msg.from();
    const content = msg.text();
    const room = msg.room();
    let reply;
    if (room) {
      const topic = await room.topic();
      console.log(`room: ${topic} send by: ${contact.name()} content: ${content}`);
      if (await msg.mentionSelf()) {
        reply = await Service.reply(content.replace(MY_NAME, ''));
        await room.say(reply);
        console.log(`tuling reply: ${reply}`);
      }
    } else {
      console.log(`sends by: ${contact.name()} content: ${content}`);
      reply = await Service.reply(content);
      await contact.say(reply);
      console.log(`tuling reply: ${reply}`);
    }
  };

  onLogout(user) {
    console.log(`user ${user} logout`);
  };

  async awake() {
    const baba = await this.boy.Contact.find({ alias: '机器人爸爸' });
    const mama = await this.boy.Contact.find({ alias: '机器人妈妈' });

    await baba.say(HELLO_WORLD);
    await mama.say(HELLO_WORLD);
    // const response = await Service.getWeather();
  };
}
