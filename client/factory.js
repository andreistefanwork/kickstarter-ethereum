import web3 from './web3';
import campaignFactoryDefinition from '../ethereum/build/contracts/CampaignFactory.json';

const { abi } = campaignFactoryDefinition;
const campaignFactory = new web3.eth.Contract(
    abi,
    "0x0a1264E3172bd23897da614B4dC486FC0A417267"
);

export default campaignFactory;