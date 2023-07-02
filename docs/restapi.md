*wip*

REST API

@Get
`/availableAccount/:username`

@Get @Post
`/readUserConversations/:username`

@Post
`/read`

@Get
`/readPreference/:username`

@Post
`/readPreference`

@Get `/readPreferences/:from`
@Get `/readPreferences/:from/:user`
@Get `/readPreferences/:from/:user/:limit`

@Get `/readMessages/:from`
@Get `/readMessages/:from/:lastid`
@Get `/readMessages/:from/:lastid/:limit`

@Get `/readNotificationCount/:from`

@Post `/account`

@Post `/write`

@Get @Post 
`/info` 

@Get @Post `/stats` 

@Get @Post `testsync` 

@Get @Post `version`
