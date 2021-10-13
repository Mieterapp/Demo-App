export store from "./src/store";
export {useDispatch, useSelector, Provider} from 'react-redux';
export {DitProvider, useDit} from "./src/providers/ditProvider";
export {CurrentUserProvider} from "./src/providers/CurrentUserProvider";
export {fetchPosts, postsSelector} from "./src/slices/posts";
export {fetchNews, newsSelector} from "./src/slices/news";
export {fetchOffers, offersSelector} from "./src/slices/offers";
export {fetchPages, pagesSelector} from "./src/slices/pages";
export {fetchFaqs, faqsSelector} from "./src/slices/faqs";
export {fetchDocuments, fetchDocument, documentsSelector} from "./src/slices/documents";
export {fetchCustomerchat, sendMessage, customerchatSelector} from "./src/slices/customerchat";
export {fetchIssues, issuesSelector} from "./src/slices/issues";
export {fetchIssuesRequsted, createIssueRequest, resetAddIssueStatus, issueRequestedSelector} from './src/slices/issuesRequested';
export {fetchContracts, fetchContract, contractsSelector} from './src/slices/contracts';
export {postDevice,getDevice, deviceSelector} from './src/slices/device'

export {login, logout, loginFailed, isAuthenticated, userSelector, getAuthenticatedUser, setUserData, registerUser, registerFailed, guest, deleteUser, verifyUser, resetPassword, changePassword} from "./src/slices/user"



