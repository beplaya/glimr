# G.L.I.M.R.
##### Git Log Inferred Metrics and Reports

```npm install glimr```
``` require('glimr'); ```

##### CLI
```node glimr-cli <project_key> <file_containing_logs> <start UNIX epoch OR 0 for all> <end UNIX epoch OR 0 for all> ```

## Outputs:

#### glimr_results_all.json
    ```
    {
    "logObjects": 
        [{
            "commit": HASH,
            "author": { "name": STRING,"email":STRING },
            "date": JS_DATE_STRING,
            "message": STRING,
            "pullRequest": { "isPullRequest": BOOLEAN, "number": INT, -1 },
            "deltas": {  "msSinceLast": REAL, "rollingAverageMs": REAL, "rollingStDevMs": REAL }
        }, ...],
    "cards":
        [{
            "key": STRING,
            "number": INT,
            "projectKey": STRING,
            "numberOfPullRequests": INT,
            "commits": [...]
        }, ...],
    "authors": 
        [{
           "name": STRING,
           "email": STRING,
           "activity": {
               "commits": [HASH,...],
               "contribution": {
                   "total": INT,
                   "totalCommitsByAll": INT,
                   "fractionOfContribution": REAL
               }
           }
        }, ...],
    "counts":
        "counts": {
            "commits": INT,
            "cards": INT,
            "pullRequests": INT
        }
    }
    ```
        
#### Break down files of glimr_results_all.json:
    - glimr_results_authors.csv
    - glimr_results_authors.json
    - glimr_results_cards.csv
    - glimr_results_cards.json
    - glimr_results_logs.csv
    - glimr_results_logs.json