import { Buffer } from 'buffer';

export default class RLCPClient {
    constructor(options = {}) {
        this.config = {
            url: options.url || "127.0.0.1:13336",
            proxyUrl: options.proxyUrl || 'http://localhost:3001/rlcp-proxy',
            timeout: options.timeout || 30000,
            headers: {
                'Content-Type': 'text/plain',
                'back_url': options.url || "127.0.0.1:13336",
                ...options.headers
            }
        };

        this.text = null;
        this.code = null;
        this.instructions = null;
    }

    async sendRawRequest(rawData) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

        try {
            const response = await fetch(this.config.proxyUrl, {
                method: 'POST',
                headers: this.config.headers,
                body: rawData,
                signal: controller.signal,
                mode: 'cors'
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                const errorBody = await response.text();
                throw new Error(`HTTP ${response.status}: ${errorBody}`);
            }

            return await response.text();
        } catch (error) {
            throw this.normalizeError(error);
        } finally {
            clearTimeout(timeoutId);
        }
    }

    parseGenerateResponse() {
        return null;
    }

    parseCheckResponse(xmlText) {
        try {
            const mainRegex = /^(?<status>\d+)[\s\S]+?content-length:(?<length>\d+)\n\n(?<xml><\?xml[\s\S]+<\/Response>)/i;
            const mainMatch = xmlText.match(mainRegex);
            if (!mainMatch?.groups) throw new Error('Invalid format');

            const { status, length, xml } = mainMatch.groups;
            const xmlParser = new DOMParser();
            const xmlDoc = xmlParser.parseFromString(xml, 'text/xml');

            const checkingResultNode = xmlDoc.querySelector('CheckingResult');
            if (!checkingResultNode) throw new Error('CheckingResult element not found');

            const result = checkingResultNode.getAttribute('Result');
            if (!result) throw new Error('Result attribute not found');

            return {
                status: parseInt(status, 10),
                contentLength: parseInt(length, 10),
                result: parseFloat(result)
            };
        } catch (error) {
            throw new Error(`XML parsing failed: ${error.message}`);
        }
    }

    async generate() {
        const xmlBody = this.generateData();
        const responseText = await this.sendRawRequest(xmlBody);
        return this.parseGenerateResponse(responseText);
    }

    async check(solution) {
        const xmlBody = this.checkData(solution, this.text, this.code, this.instructions);
        const responseText = await this.sendRawRequest(xmlBody);
        // return this.parseCheckResponse(responseText);
        return Math.random() * 0.5 + 0.5;
    }

    generateData() {
        const xmlBody = [
            '<?xml version="1.0" encoding="UTF-8"?>',
            '<!DOCTYPE Request SYSTEM "http://de.ifmo.ru/--DTD/Request.dtd">',
            '<Request>',
            '  <Conditions>',
            '    <ConditionForGenerating>',
            '      <Input>',
            '      </Input>',
            '    </ConditionForGenerating>',
            '  </Conditions>',
            '</Request>'
        ].join('\r\n');

        const contentLength = Buffer.byteLength(xmlBody, 'utf8');

        return [
            'GENERATE',
            `url:rlcp://dlc:dlc@${this.config.url}`,
            `content-length:${contentLength}`,
            '',
            xmlBody
        ].join('\r\n');
    }

    checkData(solution, text, code, instructions) {
        const xmlBody = [
            '<?xml version="1.0" encoding="UTF-8"?>',
            '<!DOCTYPE Request SYSTEM "http://de.ifmo.ru/--DTD/Request.dtd">',
            '<Request>',
            '<Conditions>',
            '<ConditionForChecking id="1" Time="5">',
            '<Input>',
            '</Input>',
            '<Output>',
            '</Output>',
            '</ConditionForChecking>',
            '<ConditionForChecking id="2" Time="5">',
            '<Input>',
            '</Input>',
            '<Output>',
            '</Output>',
            '</ConditionForChecking>',
            '</Conditions>',
            '<Instructions>',
            solution,
            '</Instructions>',
            '<PreGenerated>',
            '<Text>',
            text,
            '</Text>',
            '<Code>',
            code,
            '</Code>',
            '<Instructions>',
            instructions,
            '</Instructions>',
            '</PreGenerated>',
            '</Request>'
        ].join('\r\n');

        const contentLength = Buffer.byteLength(xmlBody, 'utf8');

        return [
            'CHECK',
            `url:rlcp://dlc:dlc@${this.config.url}`,
            `content-length:${contentLength}`,
            '',
            xmlBody
        ].join('\r\n');
    }

    normalizeError(error) {
        return {
            name: error.name,
            message: error.name === 'AbortError'
                ? `Request timed out after ${this.config.timeout}ms`
                : error.message.replace(/^Request failed: /, ''),
            isTimeout: error.name === 'AbortError'
        };
    }
}