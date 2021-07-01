const fetch = require('node-fetch')
const { MessageEmbed } = require('discord.js')
class Wikipeida {
  /**
   * @name Wikipedia
   * @kind constructor
   * @param {any} [options.message] the discord message
   * @param {string} [options.title] title of the embed
   * @param {string} [options.color] color of embed 
    * @param {string} [options.query] search query
  */

  constructor(options) {

    if (!options.color) throw new TypeError('Error Missing arugment color')
    if (typeof options.color !== 'string') throw new TypeError('Error: Color must be a string!')

    if (!options.query) throw new TypeError('Error Missing arugment query')

    if (typeof options.query !== 'string') throw new TypeError('Error: query must be a string!')

    if (!options.message) throw new TypeError('Error Missing arugment message')

    this.message = options.message
    this.color = options.color
    this.query = options.query
  }

  async fetch() {
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(this.query)}`

    let response;
    try {
      response = await fetch(url).then(res => res.json())
    } catch(e) {
      console.log('Something went wrong with Wikipedia search\n' + e)
    }
    try {
      if (response.type === 'disambiguation') {
        const embed = new MessageEmbed()
          .setTitle(response.title)
          .setColor(this.color)
          .setURL(response.content_urls.desktop.page)
          .setThumbnail(response.thumbnail.source)
          .setDescription([`
                ${response.extract}
                Other Links for the same topic: [Click Me!](${response.content_urls.desktop.page}).`])
          this.message.channel.send(embed)
      } else {
        const fullEmbed = new MessageEmbed()
          .setTitle(response.title)
          .setColor(this.color)
          .setURL(response.content_urls.desktop.page)
          .setThumbnail(response.thumbnail.source)
          .setDescription(response.extract)
          this.message.channel.send(fullEmbed)
      }
    } catch (e) {
      this.message.channel.send(new MessageEmbed().setDescription(`:x: | No results for ${this.query}`).setColor("RED"))
    }
  }
}

module.exports = Wikipeida;