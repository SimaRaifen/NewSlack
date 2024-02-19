import { WebClient, LogLevel } from '@slack/web-api';
import {core} from '@actions/core';
import { } from 'dotenv/config'

export default class Conversation {
    
    constructor(channelId, useId) {
        process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;      
        this.channelId =channelId;
        this.userId = useId;
        this.client = new WebClient(process.env.B_TOKEN, {
            logLevel:LogLevel.DEBUG
        });
    }
    
    async conversations() {
        try {
            const result = await this.client.conversations.list();
            this.getConversationsId(result.channels);
        }
        catch (error) {
            core.setFailed(error.message)
        }
    }

    getConversationsId(conversationArray) {
        for (let i = 0; i < conversationArray.length; i++) {
            this.channelId = conversationArray[i].id;
            this.conversationMembers();
        }
    }
    
    async conversationMembers() {
        const result = await this.client.conversations.members({
            channel: this.channelId
        });
        if(result.members){
            this.channelUsers(result.members)
        }
    }
    
    channelUsers(membersArray) {
        for (let i = 0; i < membersArray.length; i++) {
            this.userId = membersArray[i];
            this.sendMessageToUsers();
        }
    }
    
    async sendMessageToUsers() {
        try {
            await this.client.chat.postEphemeral({
                channel: this.channelId,
                user: this.userId,
                text: "I get information of you!"
            });
        }
        catch (error) {
            core.setFailed(error.message)
        }
    }
}

const con = new Conversation("","");
con.conversations();
