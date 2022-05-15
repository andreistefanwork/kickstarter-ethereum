import React, {Component} from 'react';
import Layout from '../../../components/Layout';
import {Button, Form, Input, Message} from 'semantic-ui-react';
import web3 from '../../../web3';
import Campaign from '../../../campaign';
import {Router} from '../../../routes';

class RequestNew extends Component {
    static async getInitialProps(props) {
        return {
            address: props.query.address
        };
    }

    state = {
        description: '',
        value: '',
        recipient: '',
        errorMessage: '',
        loading: false
    }

    onCreateRequest = async (event) => {
        event.preventDefault();

        try {
            this.setState({loading: true});

            const {description, value, recipient} = this.state;
            const accounts = await web3.eth.getAccounts();
            await Campaign(this.props.address).methods.createRequest(description, web3.utils.toWei(value, 'ether'), recipient)
                .send({ from: accounts[0] });

            this.setState({errorMessage: ''});

            await Router.pushRoute(`/campaigns/${this.props.address}/requests`);
        } catch (e) {
            this.setState({errorMessage: e.message});
        }

        this.setState({loading: false});
    };

    render() {
        return (
            <Layout>
                <h3>Create Request</h3>
                <Form error={!!this.state.errorMessage}>
                    <Form.Field>
                        <label>Description</label>
                        <Input value={this.state.description}
                               onChange={event => this.setState({description: event.target.value})}/>
                    </Form.Field>
                    <Form.Field>
                        <label>Request value</label>
                        <Input
                            label="ether"
                            labelPosition="right"
                            value={this.state.value}
                            onChange={event => this.setState({value: event.target.value})}/>
                    </Form.Field>
                    <Form.Field>
                        <label>Recipient address</label>
                        <Input value={this.state.recipient}
                               onChange={event => this.setState({recipient: event.target.value})}/>
                    </Form.Field>
                    <Message error content={this.state.errorMessage}/>
                    <Button
                        onClick={this.onCreateRequest}
                        loading={this.state.loading}
                        type="submit"
                        primary>
                        Create
                    </Button>
                </Form>
            </Layout>
        );
    }
}

export default RequestNew;