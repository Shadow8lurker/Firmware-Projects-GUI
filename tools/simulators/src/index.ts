import { UartSimulatorAdapter } from "@commwatch/transports-uart";
import { SpiSimulatorAdapter } from "@commwatch/transports-spi";
import { I2cSimulatorAdapter } from "@commwatch/transports-i2c";
import { CanSimulatorAdapter } from "@commwatch/transports-can";
import { EthernetSimulatorAdapter } from "@commwatch/transports-eth";

export function createAllSimulators() {
  return {
    uart: new UartSimulatorAdapter().createSimulator(),
    spi: new SpiSimulatorAdapter().createSimulator(),
    i2c: new I2cSimulatorAdapter().createSimulator(),
    can: new CanSimulatorAdapter().createSimulator(),
    ethernet: new EthernetSimulatorAdapter().createSimulator(),
  };
}
