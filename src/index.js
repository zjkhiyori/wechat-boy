import { Wechaty } from 'wechaty';
import QrTerm from 'qrcode-terminal';

const onScan = (qrCode) => {
  console.log('onScan: ' + qrCode);
  QrTerm.generate(qrCode);
};

const onLogin = (user) => {
  console.log(`user ${user} login !`);
  awake()
};

const onMessage = (msg) => {

};

const onLogout = (user) => {

};

const awake = () => {
  const contact = boy.Contact.find({ alias: '冰仔' });
  const room = boy.Room.find({ topic: '东城会' });
};
const boy = Wechaty.instance({ name: 'wechat-boy' });
boy.on('scan', onScan)
  .on('login', onLogin)
  .on('message', onMessage)
  .on('logout', onLogout)
  .start(() => {
    console.log('start login your wechat account')
  }).catch(e => {
    console.error(e)
  });
