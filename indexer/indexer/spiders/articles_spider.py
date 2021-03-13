import scrapy

class ArticlesSpider(scrapy.Spider):
    name = "articles"
    pega_base_url = "https://academy.pega.com"

    def start_requests(self):
        urls = [
            f"{self.pega_base_url}/mission/system-architect/v2"
        ]
        for url in urls:
            yield scrapy.Request(url=url, callback=self.parse)

    def parse(self, response):
        """Top-level parses missions and lists of modules."""
        for el in response.css('bolt-card-replacement'):
            url = el.attrib['url']
            if url.startswith('/module'):
                yield response.follow(url, callback=self.parse_module)
            elif url.startswith('/mission') and ('exercise' not in url):
                yield response.follow(url, callback=self.parse)

    def parse_module(self, response):
        """Module quiz/article link parser."""
        for el in response.css('#block-pegaacademy-theme-content bolt-trigger'):
            module_url = el.attrib['url']
            yield {
                'url': f"{self.pega_base_url}{module_url}"
            }
