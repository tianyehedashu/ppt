# 📊 数据建模与设计

现代系统的数据架构设计策略

---

## 🗄️ 数据存储选择

### 关系型数据库 (RDBMS)

<div class="db-comparison">

**适用场景**:
- 复杂查询和事务
- 数据一致性要求高
- 结构化数据

**技术选择**:
- PostgreSQL: 功能丰富，扩展性好
- MySQL: 性能优秀，生态成熟
- Oracle: 企业级功能完善

</div>

### NoSQL数据库

<div class="db-comparison">

**文档数据库 (MongoDB, CouchDB)**:
- 半结构化数据
- 快速原型开发
- 水平扩展友好

**键值存储 (Redis, DynamoDB)**:
- 高性能缓存
- 会话存储
- 计数器和排行榜

**列族数据库 (Cassandra, HBase)**:
- 大数据场景
- 时序数据
- 高写入吞吐量

</div>

---

## 📋 数据建模策略

### 1. 概念模型设计

```mermaid
erDiagram
    USER ||--o{ ORDER : places
    USER {
        int user_id PK
        string username
        string email
        datetime created_at
    }
    ORDER ||--|{ ORDER_ITEM : contains
    ORDER {
        int order_id PK
        int user_id FK
        decimal total_amount
        datetime order_date
        string status
    }
    PRODUCT ||--o{ ORDER_ITEM : includes
    ORDER_ITEM {
        int order_id FK
        int product_id FK
        int quantity
        decimal price
    }
    PRODUCT {
        int product_id PK
        string name
        string description
        decimal price
        int stock_quantity
    }
```

### 2. 规范化与反规范化

| 策略 | 优势 | 劣势 | 适用场景 |
|------|------|------|----------|
| **规范化** | 数据一致性<br>存储效率 | 查询复杂<br>性能开销 | 事务系统<br>数据仓库 |
| **反规范化** | 查询性能<br>读取效率 | 数据冗余<br>维护复杂 | 读密集系统<br>分析场景 |

---

## 🌊 数据流架构

### 批处理 vs 流处理

<div class="processing-comparison">

### 批处理 (Batch Processing)

```mermaid
graph LR
    A[数据源] --> B[数据收集]
    B --> C[批处理引擎]
    C --> D[数据存储]
    
    C --> E[Spark/Hadoop]
    E --> F[数据仓库]
```

**特点**:
- 高吞吐量
- 延迟较高
- 适合大数据分析

### 流处理 (Stream Processing)

```mermaid
graph LR
    A[实时数据] --> B[流处理引擎]
    B --> C[实时存储]
    B --> D[实时分析]
    
    B --> E[Kafka Streams]
    B --> F[Apache Flink]
```

**特点**:
- 低延迟
- 实时处理
- 适合实时监控

</div>

---

## 🏗️ 数据架构模式

### Lambda架构

```mermaid
graph TB
    DataSource[数据源] --> Batch[批处理层]
    DataSource --> Speed[速度层]
    
    Batch --> BatchView[批视图]
    Speed --> RealTimeView[实时视图]
    
    BatchView --> Serving[服务层]
    RealTimeView --> Serving
    
    Serving --> Query[查询接口]
```

**优势**: 容错性好，支持批处理和实时处理
**劣势**: 架构复杂，需要维护两套代码

### Kappa架构

```mermaid
graph TB
    DataSource[数据源] --> Stream[流处理层]
    Stream --> View[统一视图]
    View --> Query[查询接口]
```

**优势**: 架构简单，统一处理逻辑
**劣势**: 依赖流处理技术栈

---

## 📈 数据一致性策略

### 分布式事务

<div class="consistency-patterns">

### 两阶段提交 (2PC)

**优点**: 强一致性保证
**缺点**: 性能开销大，阻塞风险

### Saga模式

**优点**: 高可用性，支持长事务
**缺点**: 最终一致性，补偿逻辑复杂

### 事件溯源 (Event Sourcing)

**优点**: 完整历史记录，易于重放
**缺点**: 存储开销大，查询复杂

</div>

---

## 🛠️ 实践建议

### 数据库设计原则

1. **性能优先的设计**
   - 合理使用索引
   - 避免N+1查询
   - 考虑查询模式

2. **扩展性考虑**
   - 水平分片策略
   - 读写分离
   - 缓存层设计

3. **数据治理**
   - 数据质量监控
   - 数据血缘追踪
   - 权限管理

### 常见反模式

❌ **单表巨无霸**: 所有数据放在一张表
❌ **过度规范化**: 为了规范而规范
❌ **忽视查询模式**: 设计时不考虑实际使用
❌ **缺乏备份策略**: 没有数据恢复计划

<style>
.db-comparison {
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 20px;
  margin: 15px 0;
}

.processing-comparison h3 {
  color: #495057;
  margin: 20px 0 10px 0;
}

.consistency-patterns h3 {
  color: #495057;
  margin: 15px 0 10px 0;
  font-size: 1.1em;
}

.consistency-patterns {
  margin: 20px 0;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
}

table th, table td {
  border: 1px solid #dee2e6;
  padding: 12px;
  text-align: left;
}

table th {
  background-color: #f8f9fa;
  font-weight: 600;
}
</style>
