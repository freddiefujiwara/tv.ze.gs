<template>
  <div class="layout">
    <header class="header">
      <h1>tv.ze.gs</h1>
    </header>

    <div class="table-wrap">
      <table class="stack-table">
        <tbody>
          <!-- TV Remote Buttons -->
          <tr class="compact">
            <td data-label="Device">Switch</td>
            <td data-label="Actions">
              <div class="control-group">
                <a href="#" data-api='["switchbot-command", "-d", "02-202111271132-47468800", "-c", "turnOn"]'>On/Off</a>
              </div>
            </td>
          </tr>
          <tr class="compact">
            <td data-label="Device">ShortCut</td>
            <td data-label="Actions">
              <div class="control-group">
                <a href="#" data-api='["switchbot-custom", "-d", "02-202111271132-47468800", "-c", "regza"]'>REGZA</a>
                <a href="#" data-api='["switchbot-custom", "-d", "02-202111271132-47468800", "-c", "youtube"]'>YouTube</a>
                <a href="#" data-api='["switchbot-custom", "-d", "02-202111271132-47468800", "-c", "abema"]'>ABEMA</a>
                <a href="#" data-api='["switchbot-custom", "-d", "02-202111271132-47468800", "-c", "tver"]'>TVer</a>
              </div>
            </td>
          </tr>
          <tr class="compact">
            <td data-label="Device">Volume</td>
            <td data-label="Actions">
              <div class="control-group">
                <a href="#" data-api='["switchbot-command", "-d", "02-202111271132-47468800", "-c", "volumeSub"]'>-</a>
                <a href="#" data-api='["switchbot-command", "-d", "02-202111271132-47468800", "-c", "volumeAdd"]'>+</a>
              </div>
            </td>
          </tr>
          <tr class="compact">
            <td data-label="Device">Channel</td>
            <td data-label="Actions">
              <div class="control-group">
                <a href="#" data-api='["switchbot-command", "-d", "02-202111271132-47468800", "-c", "channelSub"]'>-</a>
                <a href="#" data-api='["switchbot-command", "-d", "02-202111271132-47468800", "-c", "channelAdd"]'>+</a>
              </div>
            </td>
          </tr>
          <tr class="compact">
            <td data-label="Device">Numbers 1-3</td>
            <td data-label="Actions">
              <div class="control-group">
                <a href="#" data-api='["switchbot-tv", "-d", "02-202111271132-47468800", "-c", "1"]'>1</a>
                <a href="#" data-api='["switchbot-tv", "-d", "02-202111271132-47468800", "-c", "2"]'>2</a>
                <a href="#" data-api='["switchbot-tv", "-d", "02-202111271132-47468800", "-c", "3"]'>3</a>
              </div>
            </td>
          </tr>
          <tr class="compact">
            <td data-label="Device">Numbers 4-6</td>
            <td data-label="Actions">
              <div class="control-group">
                <a href="#" data-api='["switchbot-tv", "-d", "02-202111271132-47468800", "-c", "4"]'>4</a>
                <a href="#" data-api='["switchbot-tv", "-d", "02-202111271132-47468800", "-c", "5"]'>5</a>
                <a href="#" data-api='["switchbot-tv", "-d", "02-202111271132-47468800", "-c", "6"]'>6</a>
              </div>
            </td>
          </tr>
          <tr class="compact">
            <td data-label="Device">Numbers 7-M</td>
            <td data-label="Actions">
              <div class="control-group">
                <a href="#" data-api='["switchbot-tv", "-d", "02-202111271132-47468800", "-c", "7"]'>7</a>
                <a href="#" data-api='["switchbot-tv", "-d", "02-202111271132-47468800", "-c", "8"]'>8</a>
                <a href="#" data-api='["switchbot-custom", "-d", "02-202111271132-47468800", "-c", "menu"]'>M</a>
              </div>
            </td>
          </tr>
          <tr class="compact">
            <td data-label="Device">Nav</td>
            <td data-label="Actions">
              <div class="control-group">
                <div class="d-pad">
                  <a href="#" style="grid-area: up" data-api='["switchbot-custom", "-d", "02-202111271132-47468800", "-c", "up"]'>↑</a>
                  <a href="#" style="grid-area: left" data-api='["switchbot-custom", "-d", "02-202111271132-47468800", "-c", "left"]'>←</a>
                  <a href="#" style="grid-area: ok" data-api='["switchbot-custom", "-d", "02-202111271132-47468800", "-c", "ok"]'>OK</a>
                  <a href="#" style="grid-area: right" data-api='["switchbot-custom", "-d", "02-202111271132-47468800", "-c", "right"]'>→</a>
                  <a href="#" style="grid-area: down" data-api='["switchbot-custom", "-d", "02-202111271132-47468800", "-c", "down"]'>↓</a>
                </div>
                <a href="#" data-api='["switchbot-custom", "-d", "02-202111271132-47468800", "-c", "back"]'>B</a>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>

<script setup>
</script>
