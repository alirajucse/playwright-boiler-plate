<h1>Playwright Boiler Plate</h1>

<h2>Install necessary packages</h2>

<pre><code>npm i</code></pre>

<h2>Run tests in GUI mode</h2>

<pre><code>npx playwright test --headed</code></pre>

<p>Run tests on different environments (dev, staging, production):</p>

<ul>
  <li>Linux: <code>APPENV=prod npx playwright test --headed</code></li>
  <li>Windows (command prompt): <code>set APPENV=prod &amp;&amp; npx playwright test --headed</code></li>
  <li>Windows (powershell): <code>$env:APPENV="prod"; npx playwright test --headed</code></li>
  <li>Mac: <code>export APPENV="prod" &amp;&amp; npx playwright test --headed</code></li>
</ul>

<p>If you don't specify environment, default environment will be used (specified in appenv.json).</p>

<h2>Run tests in CLI mode</h2>

<pre><code>npx playwright test</code></pre>

<h2>Other advanced Run tests command</h2>

<h3>Run a single test file</h3>

<pre><code>npx playwright test e2e/todo-page.spec.ts</code></pre>

<h3>Run a set of test files</h3>

<pre><code>npx playwright test e2e/todo-page/ e2e/landing-page/</code></pre>

<h3>Run tests that are in line 42 in my-spec.ts</h3>

<pre><code>npx playwright test my-spec.ts:42</code></pre>

<h3>Disable parallelization</h3>

<pre><code>npx playwright test --workers=1</code></pre>

<h3>Run in debug mode</h3>

<pre><code>npx playwright test --debug ( With Playwright Inspector)</code></pre>
<pre><code>npx playwright test --ui  ( built-in watch mode )</code></pre>
