import { Compartment } from './Compartment';
import { Hardware } from './Hardware';
import { Material } from './Material';

export interface Dimensions {
  width: number;  // mm
  height: number; // mm
  depth: number;  // mm
}

export interface CabinetParams {
  name: string;
  dimensions: Dimensions;
  compartmentConfig?: any[];
  materialId?: string;
}

/**
 * 柜子主模型
 */
export class Cabinet {
  id: string;
  name: string;
  dimensions: Dimensions;
  compartments: Compartment[] = [];
  hardware: Hardware[] = [];
  primaryMaterial?: Material;
  backMaterial?: Material;
  createdAt: Date;
  updatedAt: Date;

  constructor(params: CabinetParams) {
    this.id = this.generateId();
    this.name = params.name;
    this.dimensions = { ...params.dimensions };
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  /**
   * 生成柜子体积 (单位：m³)
   */
  getVolume(): number {
    return (this.dimensions.width * this.dimensions.height * this.dimensions.depth) / 1_000_000;
  }

  /**
   * 添加分隔间
   */
  addCompartment(compartment: Compartment): void {
    this.compartments.push(compartment);
    this.updatedAt = new Date();
  }

  /**
   * 添加五金件
   */
  addHardware(hardware: Hardware): void {
    this.hardware.push(hardware);
    this.updatedAt = new Date();
  }

  /**
   * 验证柜子配置的合理性
   */
  validate(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (this.dimensions.width <= 0) errors.push('宽度必须大于0');
    if (this.dimensions.height <= 0) errors.push('高度必须大于0');
    if (this.dimensions.depth <= 0) errors.push('深度必须大于0');

    if (this.compartments.length === 0) {
      errors.push('至少需要一个分隔间');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * 转换为 JSON 格式
   */
  toJSON(): any {
    return {
      id: this.id,
      name: this.name,
      dimensions: this.dimensions,
      compartments: this.compartments.map(c => c.toJSON()),
      hardware: this.hardware.map(h => h.toJSON()),
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString()
    };
  }

  /**
   * 生成唯一 ID
   */
  private generateId(): string {
    return `cabinet_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
