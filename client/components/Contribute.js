import React, {Component} from 'react';
import {Button, Form, Input, Message} from 'semantic-ui-react';
import web3 from '../web3';
import Campaign from '../campaign';
import { Router } from '../routes';

class Contribute extends Component {
    state = {
        errorMessage: '',
        contribution: '',
        loading: false
    }

    onContribute = async (event) => {
        event.preventDefault();

        try {
            this.setState({loading: true});

            const accounts = await web3.eth.getAccounts();
            await Campaign(this.props.address).methods.contribute().send({
                from: accounts[0],
                value: this.state.contribution
            });

            this.setState({errorMessage: ''});

            await Router.replaceRoute(`/campaigns/${this.props.address}`);
        } catch (e) {
            this.setState({errorMessage: e.message});
        }

        this.setState({loading: false});
    }

    render() {
        return (
            <div>
                <h3>Contribute to this campaign</h3>
                <Form error={!!this.state.errorMessage}>
                    <Form.Field>
                        <label>Contribution</label>
                        <Input
                            label="wei"
                            labelPosition="right"
                            value={this.state.contribution}
                            onChange={event => this.setState({contribution: event.target.value})}/>
                    </Form.Field>
                    <Message error content={this.state.errorMessage}/>
                    <Button
                        onClick={this.onContribute}
                        loading={this.state.loading}
                        type="submit"
                        primary>
                        Contribute
                    </Button>
                </Form>
            </div>
        );
    }
}

export default Contribute;