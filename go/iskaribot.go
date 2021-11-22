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

func HandleFacebook(resp http.ResponseWriter, request *http.Request) {

	verifyToken := getEnvironment("VERIFY_TOKEN")

	if request.Method == "GET" {
		u, _ := url.Parse(request.RequestURI)
		values, _ := url.ParseQuery(u.RawQuery)
		token := values.Get("hub.verify_token")
		if token == verifyToken {
			resp.WriteHeader(200)
			resp.Write([]byte(values.Get("hub.challenge")))
			return
		}
		resp.WriteHeader(400)
		resp.Write([]byte(`Bad token`))
		return
	} else {
		_, err := ioutil.ReadAll(request.Body)
		if err != nil {
			log.Printf("Failed parsing body: %s", err)
			resp.WriteHeader(400)
			resp.Write([]byte("An error occurred"))
			return
		}

	}
}

func main() {

	port := getEnvironment("PORT")
	if port == "" {
		log.Fatal("No port number entered")
	}

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
		log.Print("Must set environment variable " + varName)
	}
	return value
}
