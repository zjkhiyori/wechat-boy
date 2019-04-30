import {Wechaty} from "wechaty";
import QrTerm from "qrcode-terminal";
import Service from "./service";
import Schedule from 'node-schedule';
import {
  CONTACT_ALIAS,
  CONTACT_NAME, ENABLE_TULING_MACHINE,
  HELLO_WORLD,
  MY_NAME,
  ROOM_TPOIC,
  SCHEDULE_CONFIG,
} from "./config";

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

  async onLogin(user) {
    console.log(`user ${user.name()} login !`);
    const contact = await this.boy.Contact.find({ alias: CONTACT_ALIAS });
    const group = await this.boy.Room.find({ topic: ROOM_TPOIC });
    // 与好友打招呼
    await contact.say(HELLO_WORLD);
    // await group.say(HELLO_WORLD);
    // 发送天气
    // const weather = await Service.getWeather();
    // await contact.say(weather);
    // await group.say(weather);
    // 发送新闻头条
    // const news = await Service.getNews();
    // await contact.say(news);
    // await group.say(news);
    // 设置定时任务
    this.schedule()
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
      if (ENABLE_TULING_MACHINE && await msg.mentionSelf() && topic === ROOM_TPOIC) {
        reply = await Service.reply(content.replace(MY_NAME, ''));
        await room.say(reply);
        console.log(`tuling reply: ${reply}`);
      }
    } else {
      console.log(`sends by: ${contact.name()} content: ${content}`);
      if (ENABLE_TULING_MACHINE) {
        reply = await Service.reply(content);
        await contact.say(reply);
        console.log(`tuling reply: ${reply}`);
      }
    }
  };

  onLogout(user) {
    console.log(`user ${user} logout`);
  };

  schedule() {
    console.log('start schedule mission');
    Schedule.scheduleJob(SCHEDULE_CONFIG, async () => {
      // 每日播报天气，新闻快报
      const contact = await this.boy.Contact.find({ alias: CONTACT_ALIAS });
      await contact.say(await Service.getWeather());
      await contact.say(await Service.getNews());
    });
  }
}
