import React, {Component} from 'react';
import Layout from '../../components/Layout';
import Campaign from '../../campaign';
import { Link } from '../../routes';
import {Button, Card, Grid} from 'semantic-ui-react';
import Contribute from '../../components/Contribute';

class CampaignShow extends Component {
    static async getInitialProps(props) {
        const summary = await Campaign(props.query.address).methods.getSummary().call();

        const summaryTranslation = {
            "0": "balance",
            "1": "minimumContribution",
            "2": "requestCount",
            "3": "approversCount",
            "4": "manager"
        }

        const summaryResult = {
            campaignAddress: props.query.address
        };

        Object.keys(summary)
            .forEach(e => summaryResult[summaryTranslation[e]] = summary[e]);

        return summaryResult;
    }

    renderCampaigns() {
        const details = [
            {
                header: this.props.balance,
                description: 'Total amount of wei raised for this campaign',
                meta: 'Campaign balance',
                style: {
                    'overflowWrap': 'break-word'
                }
            },
            {
                header: this.props.minimumContribution,
                description: 'Minimum amount of wei needed to become a contributor',
                meta: 'Minimum Contribution',
                style: {
                    'overflowWrap': 'break-word'
                }
            },
            {
                header: this.props.requestCount,
                description: 'Total number of spending requests submitted by the campaign manager',
                meta: 'Spending requests',
                style: {
                    'overflowWrap': 'break-word'
                }
            },
            {
                header: this.props.approversCount,
                description: 'Total amount of people backing up this campaign',
                meta: 'Contributors',
                style: {
                    'overflowWrap': 'break-word'
                }
            }
        ];

        return <Card.Group items={details}/>;
    }

    render() {
        return (
            <Layout>
                <Grid>
                    <Grid.Column width={12}>
                        <h3>Campaign Details</h3>

                        {this.renderCampaigns()}

                        <Link route={`/campaigns/${this.props.campaignAddress}/requests`}>
                            <a>
                                <Button style={{marginTop: '10px'}} content="View Requests" primary/>
                            </a>
                        </Link>
                    </Grid.Column>
                    <Grid.Column width={4}>
                        <Contribute address={this.props.campaignAddress}/>
                    </Grid.Column>
                </Grid>
            </Layout>
        );
    }
}

export default CampaignShow;