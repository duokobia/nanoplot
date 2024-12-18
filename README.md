## Get started
Step 1: Fork the Repository
 1. Click the Fork Button: In the upper right corner of the repository page, click on the Fork button. This will create a copy of the repository under your GitHub account.

Step 2: Clone your Forked Repository
 1. Go to Your Forked Repository: Navigate to your GitHub profile and find the newly forked repository.
 2. Copy the Clone URL:
    * Click on the green Code button.
    * Choose either HTTPS, SSH, or GitHub CLI based on your preference and copy the URL.
 3. Open Your Terminal: Open a terminal or command prompt on your local machine.
 4. Run the Clone Command: Use the git clone https//xxxx.git command to clone your forked repository:

Step 3:  Navigate into Your Cloned Repository and install bun packages:
    1. cd nanoplot.
    2. 

    ```bash
    bun i
    bun run dev
    ```
    The application should run locally on your machine on port: 3000

Step 4:  Start Implementing

### Contributing Guide [Placeholder]

### Worldmap

- Make sure countries -> paths on map are mapped correctly.
- Make sure PathUtils.center is more accurate. (gpt generated and inaccurate)
- Use flag images for every country, and find CDN that's not what it's set to currently.
- Potential gradient helpers.
- Ensure tooltips have progressive enhancement from server->client, by adding ability to position tooltip to mouse via client only code.

### LineGraph

- Ensure tooltips have progressive enhancement from server->client
- 
