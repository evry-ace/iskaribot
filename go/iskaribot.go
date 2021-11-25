package main

import (
	"bytes"
	"encoding/json"
	"errors"
	"io/ioutil"
	"log"
	"net/http"
	"net/url"
	"os"
	"time"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
)

type SlackRequestBody struct {
	Text string `json:"text"`
}

type WorkplaceMessage struct {
	// Example message:
	//{ value:
	//	{ attachments: { data: [Array] },
	//	  created_time: '2021-11-07T11:19:01+0000',
	//	  community: { id: '1427629113928236' },
	//	  from: { id: '100073965725281', name: 'Thomas Qvidahl' },
	//	  message: 'Melding med bildevedlegg.',
	//	  permalink_url:
	//	   'https://evrystratus.workplace.com/groups/1059917401446886/permalink/1068662927239000/',
	//	  post_id: '1059917401446886_1068662927239000',
	//	  target_type: 'group',
	//	  type: 'photo',
	//	  verb: 'add' },
	//   field: 'posts' }

	// Mapped to struct here:
	Value []struct {
		Attachments []struct {
			Data string `json:"data"`
		} `json:"attachments"`
		CreatedTime string `json:"created_time"`
		Community   []struct {
			Id string `json:"id"`
		} `json:"community"`
		From []struct {
			Id   string `json:"id"`
			Name string `json:"name"`
		} `json:""`
		Message      string `json:"message"`
		PermalinkUrl string `json:"permalink_url"`
		PostId       string `json:"post_id"`
		TargetType   string `json:"target_type"`
		Type         string `json:"type"`
		Verb         string `json:"verb"`
	} `json:"value"`
	Field string `json:"field"`
}

func HandleFacebook(resp http.ResponseWriter, request *http.Request) {

	verifyToken := getEnvironment("VERIFY_TOKEN")

	if request.Method == "GET" {
		u, _ := url.Parse(request.RequestURI)
		values, _ := url.ParseQuery(u.RawQuery)
		token := values.Get("hub.verify_token")
		if token == verifyToken {
			resp.WriteHeader(200)
			resp.Write([]byte(values.Get("hub.challenge")))
			log.Println("Verified token...")
			return
		}
		resp.WriteHeader(400)
		resp.Write([]byte(`Bad token`))
		return
	} else if request.Method == "POST" {
		body, err := ioutil.ReadAll(request.Body)
		log.Println(body)
		if err != nil {
			log.Printf("Failed parsing body: %s", err)
			resp.WriteHeader(400)
			resp.Write([]byte("An error occurred."))
			return
		}

	}
}

func main() {

	port := getEnvironment("PORT")

	router := mux.NewRouter()
	router.HandleFunc("/", HandleFacebook).Methods("POST", "GET")

	log.Printf("Server started on %s", port)
	log.Fatal(http.ListenAndServe(":"+port, router))
}

func SendSlackNotification(webhookUrl string, msg string) error {

	slackBody, _ := json.Marshal(SlackRequestBody{Text: msg})
	req, err := http.NewRequest(http.MethodPost, webhookUrl, bytes.NewBuffer(slackBody))
	if err != nil {
		return err
	}

	req.Header.Add("Content-Type", "application/json")

	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return err
	}

	buf := new(bytes.Buffer)
	buf.ReadFrom(resp.Body)
	if buf.String() != "ok" {
		return errors.New("non-ok response returned from Slack")
	}
	return nil
}

func getEnvironment(varName string) string {

	godotenv.Load(".env")

	value, isSet := os.LookupEnv(varName)

	if !isSet || value == "" {
		log.Fatal("Must set environment variable " + varName)
	}
	return value
}
