# EFuse Frame Example

The EFuse framing format used in CommWatch demos:

```
Start: 0xAA
Type:  1 byte
Length: 1 byte (payload size)
Payload: variable
CRC: CRC-16/CCITT-FALSE over start/type/length/payload
End: 0xBB
```

Sample payload for a GPIO toggle command:

```
AA 02 03 01 00 01 4F 3A BB
```

- `0x02` → command type
- `0x03` → payload length (3 bytes)
- `0x01 0x00 0x01` → payload data
- `0x4F3A` → CRC-16/CCITT-FALSE
- `0xBB` → frame terminator
