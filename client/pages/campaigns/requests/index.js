import React, {Component} from 'react';
import Layout from '../../../components/Layout';
import {Button, Grid} from 'semantic-ui-react';
import {Link} from '../../../routes';
import Campaign from '../../../campaign';
import RequestsTable from '../../../components/RequestsTable';

class Request extends Component {
    static async getInitialProps(props) {
        const { address } = props.query;
        const campaign = Campaign(props.query.address);
        const approversCount = parseInt(await campaign.methods.approversCount().call());

        let requests = [];
        const requestsCount = parseInt(await campaign.methods.getRequestsCount().call());
        if (requestsCount) {
            requests = await Promise.all(
                Array(requestsCount).fill(0).map((_, index) => campaign.methods.requests(index).call())
            );
        }

        return {
            address,
            approversCount,
            requests
        };
    }

    render() {
        return (
            <Layout>
            <Grid>
                <Grid.Row>
                    <Grid.Column width={13}>
                        <h3>Requests</h3>
                    </Grid.Column>
                    <Grid.Column width={3}>
                        <Link route={`/campaigns/${this.props.address}/requests/new`}>
                            <a>
                                <Button content="Create Request" primary/>
                            </a>
                        </Link>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                        <RequestsTable address={this.props.address}
                                       approversCount={this.props.approversCount}
                                       requests={this.props.requests}>
                        </RequestsTable>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
            </Layout>
        );
    }
}

export default Request;