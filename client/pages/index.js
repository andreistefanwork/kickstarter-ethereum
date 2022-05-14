import React, {Component} from 'react';
import campaignFactory from '../factory';
import {Card, Button} from 'semantic-ui-react';
import Layout from '../components/Layout';
import { Link } from '../routes';

class CampaignList extends Component {

    static async getInitialProps() {
        const campaigns = await campaignFactory.methods.getDeployedCampaigns().call();

        return { campaigns };
    }

    renderCampaigns() {
        const campaigns = this.props.campaigns.map(campaign => (
            {
                header: campaign,
                description: (
                    <Link route={`/campaigns/${campaign}`}>
                        <a>View Campaign</a>
                    </Link>
                ),
                fluid: true
            }
        ));

        return <Card.Group items={campaigns}/>;
    }

    render() {
        return (
            <Layout>
                <h3>Open Campaigns</h3>
                <Link route={'/campaigns/new'}>
                    <a>
                        <Button floated="right" content="Create Campaign" icon="add circle" primary/>
                    </a>
                </Link>
                {this.renderCampaigns()}
            </Layout>
        );
    }
}

export default CampaignList;