import web3 from './web3';
import campaignFactoryDefinition from '../ethereum/build/contracts/CampaignFactory.json';

const { abi, networks } = campaignFactoryDefinition;
const campaignFactory = new web3.eth.Contract(
    abi,
    networks['4'].address
);

export default campaignFactory;