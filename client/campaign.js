import web3 from './web3';
import campaignDefinition from '../ethereum/build/contracts/Campaign.json';

const { abi } = campaignDefinition;
const campaign = (address) => new web3.eth.Contract(abi, address);

export default campaign;