import React, {Component} from 'react';
import Campaign from '../campaign';
import web3 from '../web3';
import {Router} from '../routes';
import {Button, Message, Table} from 'semantic-ui-react';

class RequestsTable extends Component {
    state = {
        errorMessage: '',
        loading: false
    }

    async createTransactionAndShowLoadingSpinner(index, methodNameOnCampaign) {
        try {
            this.setState({loading: true});
            const campaign = Campaign(this.props.address);

            const accounts = await web3.eth.getAccounts();
            await campaign.methods[methodNameOnCampaign](index).send({from: accounts[0]});

            this.setState({errorMessage: ''});

            await Router.replaceRoute(`/campaigns/${this.props.address}/requests`);
        } catch (e) {
            this.setState({errorMessage: e.message});
        }

        this.setState({loading: false});
    }

    onApprove = async (event, index) => {
        event.preventDefault();

        await this.createTransactionAndShowLoadingSpinner(index, 'approveRequest');
    }

    onFinalize = async (event, index) => {
        event.preventDefault();

        await this.createTransactionAndShowLoadingSpinner(index, 'finalizeRequest');
    }

    renderRequests = () => {
        return this.props.requests.map((request, index) => (
            <Table.Row key={index} disabled={request.complete}>
                <Table.Cell>{index}</Table.Cell>
                <Table.Cell>{request.description}</Table.Cell>
                <Table.Cell>{web3.utils.fromWei(request.value, 'ether')}</Table.Cell>
                <Table.Cell>{request.recipient}</Table.Cell>
                <Table.Cell>{`${request.approvalCount}/${this.props.approversCount}`}</Table.Cell>
                <Table.Cell>
                    {
                        request.complete ? null : (
                            <Button content="Approve"
                                    color={'green'}
                                    loading={this.state.loading}
                                    onClick={(event) => this.onApprove(event, index)}
                                    basic
                            />
                        )
                    }
                </Table.Cell>
                <Table.Cell>
                    {
                        request.complete || request.approvalCount / this.props.approversCount < .5 ? null : (
                            <Button content="Finalize"
                                    color={'violet'}
                                    loading={this.state.loading}
                                    onClick={(event) => this.onFinalize(event, index)}
                                    basic
                            />
                        )
                    }
                </Table.Cell>
            </Table.Row>
        ));
    }

    render() {
        return (
            <div>
                <Message style={{display: !!this.state.errorMessage ? 'block' : 'none'}}
                        negative
                        content={this.state.errorMessage}/>
                <Table basic>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Index</Table.HeaderCell>
                            <Table.HeaderCell>Description</Table.HeaderCell>
                            <Table.HeaderCell>Request amount</Table.HeaderCell>
                            <Table.HeaderCell>Recipient</Table.HeaderCell>
                            <Table.HeaderCell>Approval count</Table.HeaderCell>
                            <Table.HeaderCell>Approve request</Table.HeaderCell>
                            <Table.HeaderCell>Finalize request</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {this.renderRequests()}
                    </Table.Body>
                </Table>
            </div>
        );
    }
}

export default RequestsTable;