import mongoose, { Schema, model, Types } from "mongoose";

interface Operator {
  status: number;
  client: Types.ObjectId;
  operator: Types.ObjectId;
  maquina: Types.ObjectId, 
  
}

const OperatorSchema = new Schema<Operator>({
  status: { type: Number, default: 1 },
  operator: { type: Schema.Types.ObjectId, ref: "operator" },
  client: { type: Schema.Types.ObjectId, ref: "client"},
  maquina: { type: Schema.Types.ObjectId, ref: "Machine"}
},
{
  timestamps: true,
}
);

const OperatorModel = mongoose.models.Operator || model<Operator>("Operator", OperatorSchema);
export default OperatorModel;
