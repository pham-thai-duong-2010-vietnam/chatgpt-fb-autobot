import sys
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from time import sleep

msg = sys.argv[1]
thread_id = sys.argv[2]

# Mở chat.openai.com + login sẵn trước bằng acc ChatGPT Free
def init_chatgpt():
    options = Options()
    options.add_argument("--headless")
    options.add_argument("--disable-gpu")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    driver = webdriver.Chrome(options=options)
    driver.get("https://chat.openai.com")
    sleep(5)
    return driver

# Gửi tin nhắn lên ChatGPT Web + lấy câu trả lời
def ask_gpt(driver, msg):
    try:
        textarea = driver.find_element(By.TAG_NAME, "textarea")
        textarea.send_keys(msg)
        sleep(1)
        textarea.submit()
        sleep(8)
        responses = driver.find_elements(By.CLASS_NAME, "markdown")
        if responses:
            return responses[-1].text.strip()
        else:
            return "T chưa biết rep sao á 😔"
    except:
        return "Bị lỗi gòi nè 😭"

if __name__ == '__main__':
    driver = init_chatgpt()
    reply = ask_gpt(driver, msg)
    print(reply)
    driver.quit()
