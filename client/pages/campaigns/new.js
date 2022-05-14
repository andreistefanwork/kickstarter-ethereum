import React, {Component} from 'react';
import Layout from '../../components/Layout';
import {Button, Form, Input, Message} from 'semantic-ui-react';
import web3 from '../../web3';
import campaignFactory from '../../factory';
import { Router } from '../../routes';

class CampaignNew extends Component {
    state = {
        minimumContribution: '',
        errorMessage: '',
        loading: false
    };

    onCreateCampaign = async (event) => {
        event.preventDefault();

        this.setState({loading: true, errorMessage: ''});

        try {
            const accounts = await web3.eth.getAccounts();
            await campaignFactory.methods.createCampaign(this.state.minimumContribution).send({from: accounts[0]});

            await Router.pushRoute('/');
        } catch (e) {
            this.setState({errorMessage: e.message});
        }

        this.setState({loading: false});
    }

    render() {
        return (
            <Layout>
                <h3>Create a campaign</h3>
                <Form error={!!this.state.errorMessage}>
                    <Form.Field>
                        <label>Minimum contribution</label>
                        <Input
                            label="wei"
                            labelPosition="right"
                            value={this.state.minimumContribution}
                            onChange={event => this.setState({minimumContribution: event.target.value})}
                        ></Input>
                    </Form.Field>
                    <Message error content={this.state.errorMessage}></Message>
                    <Button
                        onClick={this.onCreateCampaign}
                        loading={this.state.loading}
                        type="submit"
                        primary>
                        Create Campaign
                    </Button>
                </Form>
            </Layout>
        );
    }
}

export default CampaignNew;