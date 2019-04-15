// Util functions for user

export class MemberDocumentFetcher {
    static clearMemberCache() {
        MemberDocumentFetcher.cachedMemberMap = {};
    }
    static async getUserDocument(userId, token, maybeMemberMap) {
        if (MemberDocumentFetcher.cachedMemberMap[userId]) { // check cache
            return MemberDocumentFetcher.cachedMemberMap[userId];
        };
        if (maybeMemberMap[userId]) {
            return maybeMemberMap[userId];
        };
        let result = (await API.get(`secure/user/profile?userId=${userId}`, token)).data;
        if (result) { // cache the result
            MemberDocumentFetcher.cachedMemberMap[result._id] = result;
        };
        return result;
    };
};
MemberDocumentFetcher.cachedMemberMap = {};