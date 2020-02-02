# auth-basic.js

> GitHub API Basic authentication for browsers and Node.js

[![@latest](https://img.shields.io/npm/v/@octokit/auth-basic.svg)](https://www.npmjs.com/package/@octokit/auth-basic)
[![Build Status](https://travis-ci.com/octokit/auth-basic.js.svg?branch=master)](https://travis-ci.com/octokit/auth-basic.js)
[![Greenkeeper](https://badges.greenkeeper.io/octokit/auth-basic.js.svg)](https://greenkeeper.io/)

`@octokit/auth-basic` is implementing one of [GitHub’s authentication strategies](https://github.com/octokit/auth.js): authenticating using username and password.

<!-- toc -->

- [Usage](#usage)
- [`createBasicAuth(token)` options](#createbasicauthtoken-options)
- [`auth()` options](#auth-options)
- [Authentication object](#authentication-object)
  - [Personal access token authentication](#personal-access-token-authentication)
  - [OAuth access token authentication](#oauth-access-token-authentication)
  - [Basic authentication result](#basic-authentication-result)
- [`auth.hook(request, route, options)` or `auth.hook(request, options)`](#authhookrequest-route-options-or-authhookrequest-options)
- [Implementation details](#implementation-details)
- [License](#license)

<!-- tocstop -->

## Usage

<table>
<tbody valign=top align=left>
<tr><th>
Browsers
</th><td width=100%>

Load `@octokit/auth-basic` directly from [cdn.pika.dev](https://cdn.pika.dev)

```html
<script type="module">
  import { createBasicAuth } from "https://cdn.pika.dev/@octokit/auth-basic";
</script>
```

</td></tr>
<tr><th>
Node
</th><td>

Install with <code>npm install @octokit/auth-basic</code>

```js
const { createBasicAuth } = require("@octokit/auth-basic");
// or: import { createBasicAuth } from "@octokit/auth-basic";
```

</td></tr>
</tbody>
</table>

Get token or basic authentication using the `auth()` method.

```js
const auth = createBasicAuth({
  username: "octocat",
  password: "secret",
  async on2Fa() {
    // prompt user for the one-time password retrieved via SMS or authenticator app
    return prompt("Two-factor authentication Code:");
  }
});

const tokenAuthentication = await auth({
  type: "token"
});

const basicAuthentication = await auth({
  type: "basic"
});
```

Authenticate [request](https://github.com/octokit/request.js) using `auth.hook()`

```js
const { hook } = createBasicAuth({
  username: "octocat",
  password: "secret",
  async on2Fa() {
    // prompt user for the one-time password retrieved via SMS or authenticator app
    return prompt("Two-factor authentication Code:");
  }
});
const requestWithAuth = request.defaults({ request: { hook } });

const authorizations = await requestWithAuth("GET /authorizations");
```

All strategy options

```js
const auth = createBasicAuth({
  username: "octocat",
  password: "secret",
  async on2Fa() {
    return prompt("Two-factor authentication Code:");
  },
  token: {
    note: "octokit 2019-04-03 abc4567",
    scopes: [],
    noteUrl: "https://github.com/octokit/auth.js#basic-auth",
    fingerprint: "abc4567",
    clientId: "1234567890abcdef1234",
    clientSecret: "1234567890abcdef1234567890abcdef12345678"
  },
  request: request.defaults({
    baseUrl: "https://ghe.my-company.com/api/v3"
  })
});
```

## `createBasicAuth(token)` options

<table width="100%">
  <thead align=left>
    <tr>
      <th width=150>
        name
      </th>
      <th width=70>
        type
      </th>
      <th>
        description
      </th>
    </tr>
  </thead>
  <tbody align=left valign=top>
    <tr>
      <th>
        <code>username</code>
      </th>
      <th>
        <code>string</code>
      </th>
      <td>
        <strong>Required</strong>. Username of the account to login with.
      </td>
    </tr>
    <tr>
      <th>
        <code>password</code>
      </th>
      <th>
        <code>string</code>
      </th>
      <td>
        <strong>Required</strong>. Password of the account to login with.
      </td>
    </tr>
    <tr>
      <th>
        <code>on2Fa</code>
      </th>
      <th>
        <code>function</code>
      </th>
      <td>
        <strong>Required</strong>. If the user has <a href="https://help.github.com/en/articles/securing-your-account-with-two-factor-authentication-2fa">two-factor authentication (2FA)</a> enabled, the <code>on2Fa</code> method will be called and expected to return a time-based one-time password (TOTP) which the user retrieves either via SMS or an authenticator app, based on their account settings. You can pass an empty function if you are certain the account has 2FA disabled.<br>
        <br>
        Alias: <code>on2fa</code>
      </td>
    </tr>
    <tr>
      <th>
        <code>token</code>
      </th>
      <th>
        <code>object</code>
      </th>
      <td>
        An object matching <a href="https://developer.github.com/v3/oauth_authorizations/#parameters">"Create a new authorization" parameters</a>, but camelCased.
      </td>
    </tr>
    <tr>
      <th>
        <code>token.note</code>
      </th>
      <th>
        <code>string</code>
      </th>
      <td>
        A note to remind you what the OAuth token is for. Personal access tokens must have a unique note. Attempting to create a token with with an existing note results in a <code>409 conflict error</code>.<br>
        <br>
        Defaults to "octokit <code>&lt;timestamp&gt;</code> <code>&lt;fingerprint></code>", where <code>&lt;timestamp&gt;</code> has the format <code>YYYY-MM-DD</code> and <code>&lt;fingerprint&gt;</code> is a random string. Example: "octokit 2019-04-03 abc4567".
      </td>
    </tr>
    <tr>
      <th>
        <code>token.scopes</code>
      </th>
      <th>
        <code>array of strings</code>
      </th>
      <td>
        A list of scopes that this authorization is in. See <a href="https://developer.github.com/apps/building-oauth-apps/understanding-scopes-for-oauth-apps/#available-scopes">available scopes</a><br>
        <br>
        Defaults to an empty array
      </td>
    </tr>
    <tr>
      <th>
        <code>token.noteUrl</code>
      </th>
      <th>
        <code>string</code>
      </th>
      <td>
        A URL to remind you what app the OAuth token is for.<br>
        <br>
        Defaults to "https://github.com/octokit/auth-basic.js#readme"
      </td>
    </tr>
    <tr>
      <th>
        <code>token.fingerprint</code>
      </th>
      <th>
        <code>string</code>
      </th>
      <td>
        A unique string to distinguish an authorization from others created for the same client ID and user.<br>
        <br>
        Defaults to a random string
      </td>
    </tr>
    <tr>
      <th>
        <code>token.clientId</code>
      </th>
      <th>
        <code>string</code>
      </th>
      <td>
        The 20 character OAuth app client key for which to create the token.
      </td>
    </tr>
    <tr>
      <th>
        <code>token.clientSecret</code>
      </th>
      <th>
        <code>string</code>
      </th>
      <td>
        The 40 character OAuth app client secret for which to create the token.<br>
        <br>
        <strong>Note</strong>: do not share an OAuth app’s client secret with an untrusted client such as a website or native app.
      </td>
    </tr>
    <tr>
      <th>
        <code>request</code>
      </th>
      <th>
        <code>function</code>
      </th>
      <td>
        You can pass in your own <a href="https://github.com/octokit/request.js"><code>@octokit/request</code></a> instance. For usage with enterprise, set <code>baseUrl</code> to the hostname + <code>/api/v3</code>. Example:

```js
const { request } = require("@octokit/request");
createAppAuth({
  clientId: 123,
  clientSecret: "secret",
  request: request.defaults({
    baseUrl: "https://ghe.my-company.com/api/v3"
  })
});
```

</td></tr>
  </tbody>
</table>

## `auth()` options

<table width="100%">
  <thead align=left>
    <tr>
      <th width=150>
        name
      </th>
      <th width=70>
        type
      </th>
      <th>
        description
      </th>
    </tr>
  </thead>
  <tbody align=left valign=top>
    <tr>
      <th>
        <code>type</code>
      </th>
      <th>
        <code>string</code>
      </th>
      <td>
        Either <code>"basic"</code> or <code>"token"</code>. Defaults to <code>"token"</code>.
      </td>
    </tr>
    <tr>
      <th>
        <code>refresh</code>
      </th>
      <th>
        <code>boolean</code>
      </th>
      <td>
        If set to <code>true</code>, a new token is created and cached. Only relevent if <code>type</code> is set to <code>"token"</code>.
        <br>
        Defaults to <code>false</code>.
      </td>
    </tr>
  </tbody>
</table>

## `auth()` result

There are three possible results that the async `auth()` method can resolve to

1. **A personal access token authentication**  
   `auth({type: 'token'})` and `basic.token.clientId` / `basic.token.clientSecret` _not_ passed as strategy options.
2. **An OAuth access token authentication**  
   `auth({type: 'token'})` and `basic.token.clientId` / `basic.token.clientSecret` passed as strategy options.
3. **Basic authentication**  
   `auth({type: 'basic'})`

### Personal access token authentication

<table width="100%">
  <thead align=left>
    <tr>
      <th width=150>
        name
      </th>
      <th width=70>
        type
      </th>
      <th>
        description
      </th>
    </tr>
  </thead>
  <tbody align=left valign=top>
    <tr>
      <th>
        <code>type</code>
      </th>
      <th>
        <code>string</code>
      </th>
      <td>
        <code>"token"</code>
      </td>
    </tr>
    <tr>
      <th>
        <code>tokenType</code>
      </th>
      <th>
        <code>string</code>
      </th>
      <td>
        <code>"pat"</code>
      </td>
    </tr>
    <tr>
      <th>
        <code>token</code>
      </th>
      <th>
        <code>string</code>
      </th>
      <td>
        The personal access token
      </td>
    </tr>
    <tr>
      <th>
        <code>id</code>
      </th>
      <th>
        <code>number</code>
      </th>
      <td>
        Database ID of token
      </td>
    </tr>
    <tr>
      <th>
        <code>username</code>
      </th>
      <th>
        <code>string</code>
      </th>
      <td>
       Username of authenticated user
      </td>
    </tr>
    <tr>
      <th>
        <code>scopes</code>
      </th>
      <th>
        <code>array of strings</code>
      </th>
      <td>
        array of scope names
      </td>
    </tr>
  </tbody>
</table>

### OAuth access token authentication

<table width="100%">
  <thead align=left>
    <tr>
      <th width=150>
        name
      </th>
      <th width=70>
        type
      </th>
      <th>
        description
      </th>
    </tr>
  </thead>
  <tbody align=left valign=top>
    <tr>
      <th>
        <code>type</code>
      </th>
      <th>
        <code>string</code>
      </th>
      <td>
        <code>"token"</code>
      </td>
    </tr>
    <tr>
      <th>
        <code>tokenType</code>
      </th>
      <th>
        <code>string</code>
      </th>
      <td>
        <code>"oauth"</code>
      </td>
    </tr>
    <tr>
      <th>
        <code>token</code>
      </th>
      <th>
        <code>string</code>
      </th>
      <td>
        The oauth access token
      </td>
    </tr>
    <tr>
      <th>
        <code>username</code>
      </th>
      <th>
        <code>string</code>
      </th>
      <td>
       Username of authenticated user
      </td>
    </tr>
    <tr>
      <th>
        <code>id</code>
      </th>
      <th>
        <code>number</code>
      </th>
      <td>
        Database ID of token
      </td>
    </tr>
    <tr>
      <th>
        <code>appClientId</code>
      </th>
      <th>
        <code>number</code>
      </th>
      <td>
        OAuth application’s client ID
      </td>
    </tr>
    <tr>
      <th>
        <code>scopes</code>
      </th>
      <th>
        <code>array of strings</code>
      </th>
      <td>
        array of scope names
      </td>
    </tr>
  </tbody>
</table>

### Basic authentication result

<table width="100%">
  <thead align=left>
    <tr>
      <th width=150>
        name
      </th>
      <th width=70>
        type
      </th>
      <th>
        description
      </th>
    </tr>
  </thead>
  <tbody align=left valign=top>
    <tr>
      <th>
        <code>type</code>
      </th>
      <th>
        <code>string</code>
      </th>
      <td>
        <code>"basic"</code>
      </td>
    </tr>
    <tr>
      <th>
        <code>username</code>
      </th>
      <th>
        <code>string</code>
      </th>
      <td>
        The decoded username
      </td>
    </tr>
    <tr>
      <th>
        <code>password</code>
      </th>
      <th>
        <code>string</code>
      </th>
      <td>
        The decoded password
      </td>
    </tr>
    <tr>
      <th>
        <code>credentials</code>
      </th>
      <th>
        <code>string</code>
      </th>
      <td>
        base64-encoded string that can be used in <code>Authorization</code> header.
      </td>
    </tr>
    <tr>
      <th>
        <code>totp</code>
      </th>
      <th>
        <code>string</code>
      </th>
      <td>
        The time-based one-time password returned by <code>options.on2Fa()</code>. Only present if 2Fa authentication is enabled for the account.
      </td>
    </tr>
  </tbody>
</table>

## `auth.hook(request, route, options)` or `auth.hook(request, options)`

`auth.hook()` hooks directly into the request life cycle. It authenticates the request using either basic authentication or a token based on the request URL and handles two-factor authentication with request retries.

The `request` option is an instance of [`@octokit/request`](https://github.com/octokit/request.js#readme). The `route`/`options` parameters are the same as for the [`request()` method](https://github.com/octokit/request.js#request).

`auth.hook()` can be called directly to send an authenticated request

```js
const { data: authorizations } = await auth.hook(
  request,
  "GET /authorizations"
);
```

Or it can be passed as option to [`request()`](https://github.com/octokit/request.js#request).

```js
const requestWithAuth = request.defaults({
  request: {
    hook: auth.hook
  }
});

const { data: authorizations } = await requestWithAuth("GET /authorizations");
```

The `on2Fa()` method passed as strategy option is (re-)called as needed.[`request()` method](https://github.com/octokit/request.js#request)

## Implementation details

GitHub recommends to use basic authentication only for managing [personal access tokens](https://github.com/settings/tokens). By default, the `auth.hook()` method implements this best practice and retrieves a personal access token to authenticate requests. All personal access tokens must have a unique `note` / `fingerprint`. The `auth()` method is setting a defaults that are always different to avoid conflicts. But if you set a custom `token.note` option, `fingerprint` is not set to a random string by default in order to avoid multiple tokens with the same note.

Some endpoint however do require basic authentication, such as [List your authorizations](https://developer.github.com/v3/oauth_authorizations/#list-your-authorizations) or [Delete an authorization](https://developer.github.com/v3/oauth_authorizations/#delete-an-authorization). The `auth.hook()` method is setting the correct authorization automatically based on the request URL.

There is a special case if the user enabled [two-factor authentication](https://github.com/settings/security) with SMS as method, because an SMS with the time-based one-time password (TOTP) will only be sent if a request is made to one of these endpoints

- [`POST /authorizations`](https://developer.github.com/v3/oauth_authorizations/#create-a-new-authorization) - Create a new authorization
- [`PUT /authorizations/clients/:client_id`](https://developer.github.com/v3/oauth_authorizations/#get-or-create-an-authorization-for-a-specific-app) - Get-or-create an authorization for a specific app
- [`PUT /authorizations/clients/:client_id/:fingerprint`](https://developer.github.com/v3/oauth_authorizations/#get-or-create-an-authorization-for-a-specific-app-and-fingerprint) - Get-or-create an authorization for a specific app and fingerprint
- [`PATCH /authorizations/:authorization_id`](https://developer.github.com/v3/oauth_authorizations/#update-an-existing-authorization) - Update an existing authorization

To guarantee the TOTP delivery via SMS, `auth.hook()` is sending an additional request which has no other effect.

## License

[MIT](LICENSE)
