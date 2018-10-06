import { Button, Checkbox, Col, Form, Input, Layout, notification, Row } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import * as React from 'react';
import './App.css';

const { Header, Footer, Content } = Layout;
const FormItem = Form.Item;

const APIURL : string = "YOUR_API_URL_HERE";
const APIKEY : string = "YOUR_API_KEY_HERE";

interface IState {
  addToSubscribers: boolean;
  email: string;
  sendSlackInvite: boolean;
}

interface IProps {
  addToSubscribers?: boolean;
  email?: string;
  sendSlackInvite?: boolean;
}

class App extends React.Component<IProps, IState, {}> {
  public state: IState = {
    addToSubscribers: false,
    email: "",
    sendSlackInvite: false,
  }
  constructor(props: IProps) {
    super(props);
    this.formOnSubmit = this.formOnSubmit.bind(this);
  }
  public render() {
    return (
      <div className="App" style={{}}>
        <Layout>
          <Header style={{minHeight:"18vh", color: "white", fontSize: "large"}}>Pioco ry – sähköpostilistalle liittyminen ja Slack-invite</Header>
          <Content style={{minHeight:"72vh"}}>
            <div style={{minHeight: "30px"}} />
            <Row>
              <Col span={16} offset={4}>
                <Form onSubmit={this.formOnSubmit} className="info-form">
                  <FormItem label="Sähköposti" labelCol={{ xs: { span: 24 }, sm: { span: 5 }}} wrapperCol={{ xs: { span: 24 }, sm: { span: 14 }}}>
                      <Input  type="email" onChange={this.emailOnChange} value={this.state.email} name="email" placeholder="foo@bar.com" />
                  </FormItem>
                  <FormItem style={{textAlign: "left"}} wrapperCol={{ xs: { span: 24, offset: 0 }, sm: { span: 14, offset: 5 }}}>
                    <Checkbox onChange={this.slackCheckboxOnChange}checked={this.state.sendSlackInvite}>Haluan slack-kutsun</Checkbox>
                  </FormItem>
                  <FormItem style={{textAlign: "left"}} wrapperCol={{ xs: { span: 24, offset: 0 }, sm: { span: 14, offset: 5 }}}>
                    <Checkbox onChange={this.subscribeCheckboxOnChange} checked={this.state.addToSubscribers}>Annan luvan tallentaa sähköpostiosoitteeni ja lähestyä sähköpostitse, kun yhdistykseen voi liittyä</Checkbox>
                  </FormItem>
                  <FormItem>
                    <Button type="primary" htmlType="submit" className="info-form-button">Lähetä</Button>
                  </FormItem>
                </Form>
              </Col>
            </Row>
          </Content>
          <Footer style={{minHeight:"10vh"}}>
            <Row>
              <Col span={18} offset={2} style={{textAlign: "left"}}>Pioco ry – <a href="https://pioco.fi/tietosuojaseloste.html">Tietosuojaseloste</a></Col>
            </Row>
          </Footer>
        </Layout>
      </div>
    );
  }
  private formOnSubmit(e: React.FormEvent<HTMLInputElement>) {
    // tslint:disable-next-line:no-console
    e.preventDefault();
    if(this.state.addToSubscribers === false && this.state.sendSlackInvite === false) {
      notification.open({message: 'Viestiä ei lähetetty', description: 'Valitse joko Slack-invite, listalle liittyminen, tai molemmat.'});
    } else {
      this.sendPayload(this.state);
    }
  }
  private emailOnChange = (e: React.ChangeEvent<HTMLInputElement>) => this.setState({email: e.target.value});
  private sendPayload (state: IState) {
    return fetch(APIURL, {
      body: JSON.stringify(state),
      // credentials: 'include',
      headers: new Headers({'Accept': 'application/json', 'Content-Type': 'application/json; charset=utf-8', 'x-api-key': APIKEY}),
      method: 'POST',
      mode: 'cors',
    }).then(res => res.json())
    .then(response => notification.open({message: 'Lähetys onnistui', description: 'Mikäli halusit slack-kutsun, saat sen piakkoin sähköpostiisi.'}))
    .catch(error => notification.open({message: 'Lähetys epäonnistui', description: 'Jotakin meni vikaan :-(\n\n' + error}));
  }
  private slackCheckboxOnChange = (e: CheckboxChangeEvent) => this.setState({sendSlackInvite: e.target.checked});
  private subscribeCheckboxOnChange = (e: CheckboxChangeEvent) => this.setState({addToSubscribers: e.target.checked});
}

export default App;
