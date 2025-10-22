# EFuse Frame Example

The EFuse custom frame format wraps payloads with start/end delimiters and CRC-16/CCITT-FALSE integrity.

```
0xAA  <type>  <length>  <payload...>  <CRC_H>  <CRC_L>  0xBB  0x00
```

Example payload for a status frame:

- Type: `0x01`
- Payload: `0x10 0x20 0x30`

Using the CLI helper:

```bash
node apps/cli/dist/index.js replay --proto uart --in docs/examples/efuse-frame.json
```

The corresponding JSON entry:

```json
[
  {
    "meta": {
      "timestamp": 0,
      "direction": "tx",
      "protocol": "uart"
    },
    "data": "aa0103102030f7c0bb00"
  }
]
```
